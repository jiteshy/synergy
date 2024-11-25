# Plugin configuration

The following configuration options are available for your app-config.yaml:

```yaml
synergy:
  provider:
    github:
      org: jiteshy-synergy
      host: https://github.com
      apiBaseUrl: https://api.github.com
      token: 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
  repoTag: inner-source
```

The configuration values are:

- provider
  - Type: Object
  - Required: Yes
  - Details: configurations required to integrate GitHub as the source of truth for Inner-Source dashboard.
    - Note: As of now, the plugin only supports GitHub.
- provider.github.org
  - Type: string
  - Required: Yes
  - Details: GitHub Org name you want to fetch the Inner-Source projects and issues from.
- provider.github.host
  - Type: string
  - Required: Yes
  - Details: GitHub host url e.g. https://github.com
- provider.github.apiBaseUrl
  - Type: string
  - Required: Yes
  - Details: Base url to call GitHub APIs e.g. https://api.github.com
- provider.github.token
  - Type: string
  - Required: Yes
  - Details: GitHub access token.
- repoTag
  - Type: string
  - Required: Yes
  - Details: Topic or Label used Inner-Source projects or issues e.g. "inner-source"