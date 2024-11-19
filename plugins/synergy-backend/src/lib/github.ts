import { graphql } from '@octokit/graphql';
import { DataProviderConfig } from './configReader';
import { SingleInstanceGithubCredentialsProvider } from '@backstage/integration';
import {
  Project,
  ProjectDetails,
  Contributors,
  SynergyApi,
} from '@jiteshy/backstage-plugin-synergy-common';

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

type RepositoryPrimaryLanguage = {
  name: string;
};

type Repository = {
  id: string;
  name: string;
  description: string;
  url: string;
  visibility: string;
  isPrivate: boolean;
  owner: RepositoryOwner;
  updatedAt: string;
  defaultBranchRef: RepositoryBranchRef;
  primaryLanguage: RepositoryPrimaryLanguage;
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
  id: string;
  url: string;
  author: RepositoryIssueAuthor;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

type RepositoryIssues = {
  nodes: RepositoryIssue[];
};

type RepositoryPinnedIssue = {
  issue: RepositoryIssue
}

type RepositoryPinnedIssues = {
  nodes: RepositoryPinnedIssue[];
};

type RepositoryDetails = Repository & {
  readme: RepositoryReadme;
  issues: RepositoryIssues;
  pinnedIssues: RepositoryPinnedIssues;
};

type ProjectsQueryResponse = {
  search: {
    nodes: Repository[];
  };
};

type ProjectQueryResponse = {
  repository: RepositoryDetails;
};

const GITHUB_REPO_QUERY_BASE_FIELDS = `
  id
  name
  description
  url
  visibility
  isPrivate
  updatedAt
  owner {
    login
  }
  primaryLanguage {
    name
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
  pullRequests (
    states: MERGED,
    first: 100,
    orderBy: {field: UPDATED_AT, direction: DESC}
  ) {
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
}: DataProviderConfig): Promise<SynergyApi> {
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
        query repositories {
          search(type: REPOSITORY, query: "org:${org} topic:${repoTag} fork:true archived:false", first: 100) {
            nodes {
              ... on Repository {
                ${GITHUB_REPO_QUERY_BASE_FIELDS}
                issues {
                  totalCount
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }`;

      const response: ProjectsQueryResponse = await client(query);
      
      return response.search.nodes
        .map((repo: Repository) => formatProject(repo, repoTag))
        .sort((p1: Project, p2: Project) => {
          return (
            new Date(p2.updatedAt).getTime() - new Date(p1.updatedAt).getTime()
          );
        });
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
                  id
                  url
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
                    id
                    url
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
        ...formatProject(repo, repoTag),
        readme: repo.readme.text,
        issues: repo.issues.nodes,
        pinnedIssues: repo.pinnedIssues.nodes.map(pinned => pinned.issue),
      };
    },
  };
}

function formatProject(repo: Repository, repoTag: string): Project {
  const topics: string[] = [];
  repo.repositoryTopics?.nodes.forEach((topicNode: TopicNode) => {
    if (topicNode.topic && topicNode.topic.name !== repoTag) {
      topics.push(topicNode.topic.name.toLowerCase());
    }
  });
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description,
    url: repo.url,
    visibility: repo.visibility,
    isPrivate: repo.isPrivate,
    owner: repo.owner?.login,
    updatedAt: new Date(repo.updatedAt).toDateString(),
    primaryLanguage: repo.primaryLanguage?.name?.toLowerCase(),
    languages: repo.languages?.nodes.map(
      (languageNode: LanguageNode) => languageNode.name,
    ),
    topics: topics,
    starsCount: repo.stargazerCount,
    issuesCount: repo.issues.totalCount,
    contributionsCount: repo.pullRequests.totalCount,
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
