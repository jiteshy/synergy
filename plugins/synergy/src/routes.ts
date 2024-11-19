import { createRouteRef, createSubRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'synergy',
});

export const projectRouteRef = createSubRouteRef({
  id: 'synergy/project',
  parent: rootRouteRef,
  path: '/project/:owner/:project',
});
