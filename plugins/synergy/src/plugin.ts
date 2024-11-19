import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { synergyApiRef } from './api';
import { SynergyClient } from './api';

export const synergyPlugin = createPlugin({
  id: 'synergy',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: synergyApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new SynergyClient({ discoveryApi, fetchApi }),
    }),
  ],
});

export const SynergyPage = synergyPlugin.provide(
  createRoutableExtension({
    name: 'SynergyPage',
    component: () =>
      import('./components/SynergyPage').then(m => m.SynergyPage),
    mountPoint: rootRouteRef,
  }),
);
