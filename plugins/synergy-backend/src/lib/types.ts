export type Contributors = {
  [name: string]: number;
};

export type Project = {
  name: string;
  description: string;
  url: string;
  visibility: string;
  owner: string;
  languages: string[];
  topics: string[];
  starsCount: number;
  issuesCount: number;
  totalContributions: number;
  contributors: Contributors;
};

export type ProjectIssueAuthor = {
  login: string;
  url: string;
};

export type ProjectIssue = {
  author: ProjectIssueAuthor;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectDetails = Project & {
  readme: string;
  issues: ProjectIssue[];
  pinnedIssues: ProjectIssue[];
};

export interface DataProviderImpl {
  getProjects(): Promise<Project[]>;
  getProject(name: string, owner: string): Promise<ProjectDetails>;
}
