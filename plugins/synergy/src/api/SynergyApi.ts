import { createApiRef } from '@backstage/core-plugin-api';
import { SynergyApi } from '@jiteshy/backstage-plugin-synergy-common';

export const synergyApiRef = createApiRef<SynergyApi>({
  id: 'plugin.synergy.service',
});
