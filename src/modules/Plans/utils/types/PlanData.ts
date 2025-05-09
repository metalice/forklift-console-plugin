import type { ProvidersPermissionStatus } from 'src/modules/Providers/utils/types/ProvidersPermissionStatus';

import type { V1beta1Plan } from '@kubev2v/types';

export type PlanData = {
  plan?: V1beta1Plan;
  permissions?: ProvidersPermissionStatus;
};
