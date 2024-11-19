export type KeyValue = {
  [key: string]: string;
};

export type Contributors = {
  [name: string]: number;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  url: string;
  visibility: string;
  isPrivate: boolean;
  owner: string;
  primaryLanguage: string;
  languages: string[];
  topics: string[];
  starsCount: number;
  issuesCount: number;
  contributionsCount: number;
  contributors: Contributors;
  updatedAt: string;
};

export type ProjectIssueAuthor = {
  login: string;
  url: string;
};

export type ProjectIssue = {
  id: string;
  url: string;
  author: ProjectIssueAuthor;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectPinnedIssue = {
  issue: ProjectIssue
}

export type ProjectDetails = Project & {
  readme: string;
  issues: ProjectIssue[];
  pinnedIssues: ProjectIssue[];
};

export interface SynergyApi {
  getProjects(): Promise<Project[]>;
  getProject(name: string, owner: string): Promise<ProjectDetails>;
}
