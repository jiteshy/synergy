# synergy

Welcome to the synergy plugin!

_This plugin was created through the Backstage CLI_

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/synergy](http://localhost:3000/synergy).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.

## Installation

Add the plugin to your frontend app:

```bash
yarn workspace app add @jiteshy/backstage-plugin-synergy
```

Expose the Synergy page:

```ts
// packages/app/src/App.tsx
import { SynergyPage } from '@jiteshy/backstage-plugin-synergy';

// ...

const AppRoutes = () => (
  <FlatRoutes>
    // ...
    <Route path="/synergy" element={<SynergyPage />} />
    // ...
  </FlatRoutes>
);
```

Add the navigation in the frontend:

```ts
// packages/app/src/components/Root/Root.tsx
import DeviceHubOutlined from '@material-ui/icons/DeviceHubOutlined';
// ...
export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    // ...
    <SidebarItem icon={DeviceHubOutlined} to="synergy" text="Synergy" />
    // ...
  </SidebarPage>
);
```

## Configuration

The following configuration options are available for your app-config.yaml:

```yaml
synergy:
  provider:
    github:
      hideIssues: <Optional true/false. Refer details below.>
```

The configuration values are:

- provider.github.hideIssues
  - Type: boolean
  - Required: No
  - Details: Boolean indicating whether to hide the issues tab (e.g., when Issues not used in GitHub projects). Default is false. If true, only the project list and details (README & Contributing Guidelines) will be available, as other views depend on issues.
