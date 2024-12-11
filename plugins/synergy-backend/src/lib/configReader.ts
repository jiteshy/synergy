import { Config } from '@backstage/config';

export type DataProviderConfig = {
  provider: string;
  org: string;
  host: string;
  apiBaseUrl: string;
  token: string;
  repoTag: string;
};

export function readConfig(config: Config): DataProviderConfig {
  const repoTag = config.getString('synergy.repoTag');

  const synergyConfig = config.getConfig('synergy.provider');
  // As of now, only Github provider is supported.
  // This needs to be revisited when multiple providers are supported.
  const provider = 'github';
  const providerConfig = synergyConfig.getConfig(provider);
  const org = providerConfig.getString('org');
  const host = providerConfig.getString('host');
  const token = providerConfig.getString('token');
  const apiBaseUrl = providerConfig.getString('apiBaseUrl');

  return {
    provider,
    org,
    host,
    apiBaseUrl,
    token,
    repoTag,
  };
}
