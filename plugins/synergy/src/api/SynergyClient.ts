import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import {
  KeyValue,
  Project,
  ProjectDetails,
  SynergyApi,
} from '@jiteshy/backstage-plugin-synergy-common';

export class SynergyClient implements SynergyApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  public constructor(options: {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  getProjects(): Promise<Project[]> {
    const urlSegment = 'projects';

    return this.get<Project[]>(urlSegment);
  }
  getProject(name: string, owner: string): Promise<ProjectDetails> {
    const params = { name, owner };
    const urlSegment = 'project';

    return this.get<ProjectDetails>(urlSegment, params);
  }

  private async get<T>(path: string, params?: KeyValue): Promise<T> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('synergy')}/`;
    const url = new URL(path, baseUrl);
    if (params) {
      Object.keys(params).forEach((key: string) => {
        url.searchParams.append(key, params[key]);
      });
    }

    const response = await this.fetchApi.fetch(url.toString());

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json() as Promise<T>;
  }
}
