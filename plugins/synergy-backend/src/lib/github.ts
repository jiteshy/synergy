import { graphql } from '@octokit/graphql';
import { DataProviderConfig } from './configReader';
import { SingleInstanceGithubCredentialsProvider } from '@backstage/integration';
import {
  Project,
  DataProviderImpl,
  ProjectDetails,
  Contributors,
} from './types';

type TopicNode = {
  topic: {
    name: string;
  };
};

type RepositoryTopics = {
  nodes: TopicNode[];
};

type LanguageNode = {
  name: string;
};

type RepositoryLanguages = {
  nodes: LanguageNode[];
};

type RepositoryIssuesCount = {
  totalCount: number;
};

type RepositoryOwner = {
  login: string;
};

type RepositoryBranchRef = {
  name: string;
};

type RepositoryPullRequestAuthor = {
  login: string;
};

type RepositoryPullRequestNode = {
  author: RepositoryPullRequestAuthor;
  baseRef: RepositoryBranchRef;
};

type RepositoryPullRequest = {
  totalCount: number;
  nodes: RepositoryPullRequestNode[];
};

type Repository = {
  name: string;
  description: string;
  url: string;
  visibility: string;
  owner: RepositoryOwner;
  defaultBranchRef: RepositoryBranchRef;
  languages: RepositoryLanguages;
  repositoryTopics: RepositoryTopics;
  stargazerCount: number;
  issues: RepositoryIssuesCount;
  pullRequests: RepositoryPullRequest;
};

type RepositoryReadme = {
  text: string;
};

type RepositoryIssueAuthor = {
  login: string;
  url: string;
};

type RepositoryIssue = {
  author: RepositoryIssueAuthor;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

type RepositoryIssues = {
  nodes: RepositoryIssue[];
};

type RepositoryDetails = Repository & {
  readme: RepositoryReadme;
  issues: RepositoryIssues;
  pinnedIssues: RepositoryIssues;
};

type ProjectsQueryResponse = {
  repositoryOwner: {
    repositories: {
      nodes: Repository[];
    };
  };
};

type ProjectQueryResponse = {
  repository: RepositoryDetails;
};

const GITHUB_REPO_QUERY_BASE_FIELDS = `
  name
  description
  url
  visibility
  owner {
    login
  }
  defaultBranchRef {
    name
  }
  languages (first: 100) {
    nodes {
      ... on Language {
        name
      }
    }
  }
  stargazerCount
  repositoryTopics(first: 100) {
    nodes {
      ... on RepositoryTopic {
        topic {
          name
        }
      }
    }
  }
  pullRequests (states: MERGED, first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
    totalCount
    nodes {
      author {
        login
      }
      baseRef {
        name
      }
    }
  }
`;

export async function githubProviderImpl({
  org,
  host,
  apiBaseUrl,
  token,
  repoTag,
}: DataProviderConfig): Promise<DataProviderImpl> {
  const githubCredentialsProvider =
    SingleInstanceGithubCredentialsProvider.create({ host, token });
  const orgUrl = `https://${host}/${org}`;
  const { headers } = await githubCredentialsProvider.getCredentials({
    url: orgUrl,
  });
  const client = graphql.defaults({
    baseUrl: apiBaseUrl,
    headers,
  });

  return {
    getProjects: async (): Promise<Project[]> => {
      const query = `
        query repositories($org: String!, $cursor: String) {
          repositoryOwner(login: $org) {
            login
            repositories(first: 100, after: $cursor, isArchived: false, orderBy: {field: NAME, direction: ASC}) {
              nodes {
                ${GITHUB_REPO_QUERY_BASE_FIELDS}
                issues {
                  totalCount
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }`;

      let cursor: string | undefined = undefined;
      const response: ProjectsQueryResponse = await client(query, {
        org,
        cursor,
      });

      return response.repositoryOwner.repositories.nodes.reduce(
        (filtered: Project[], repo: Repository): Project[] => {
          const topics = repo.repositoryTopics.nodes.map(
            (topicNode: TopicNode) => topicNode.topic.name,
          );
          if (topics.includes(repoTag)) {
            filtered.push(formatProject(repo, topics));
          }
          return filtered;
        },
        [],
      );
    },
    getProject: async (
      name: string,
      owner: string,
    ): Promise<ProjectDetails> => {
      const query = `
        query repository($name: String!, $owner: String!) {
          repository(name: $name, owner: $owner) {
            ${GITHUB_REPO_QUERY_BASE_FIELDS}
            issues (first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
              nodes {
                ... on Issue {
                  author {
                    login
                    url
                  }
                  title
                  body
                  createdAt
                  updatedAt
                }
              }
              totalCount
            }
            pinnedIssues(first: 100) {
              nodes {
                ... on PinnedIssue {
                  issue {
                    author {
                      login
                      url
                    }
                    title
                    body
                    createdAt
                    updatedAt
                  }
                }
              }
            }
            readme: object(expression: "HEAD:README.md") {
              ... on Blob {
                text
              }
            }     
          } 
        }`;

      const response: ProjectQueryResponse = await client(query, {
        name,
        owner,
      });

      const repo = response.repository;
      return {
        ...formatProject(repo),
        readme: repo.readme.text,
        issues: repo.issues.nodes,
        pinnedIssues: repo.pinnedIssues.nodes,
      };
    },
  };
}

function formatProject(repo: Repository, topics?: string[]): Project {
  return {
    name: repo.name,
    description: repo.description,
    url: repo.url,
    visibility: repo.visibility,
    owner: repo.owner.login,
    languages: repo.languages.nodes.map(
      (languageNode: LanguageNode) => languageNode.name,
    ),
    topics:
      topics ||
      repo.repositoryTopics.nodes.map(
        (topicNode: TopicNode) => topicNode.topic.name,
      ),
    starsCount: repo.stargazerCount,
    issuesCount: repo.issues.totalCount,
    totalContributions: repo.pullRequests.totalCount,
    contributors: parseContributors(repo),
  };
}

function parseContributors(repo: Repository) {
  const pullRequests = repo.pullRequests.nodes.filter(
    (prNode: RepositoryPullRequestNode) =>
      prNode.baseRef.name === repo.defaultBranchRef.name,
  );
  const contributors = pullRequests.reduce(
    (contributors: Contributors, prNode: RepositoryPullRequestNode) => {
      const author = prNode.author.login;
      if (!contributors[author]) {
        contributors[author] = 0;
      }
      contributors[author]++;
      return contributors;
    },
    {},
  );
  return contributors;
}
