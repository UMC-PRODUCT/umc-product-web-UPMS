import { api } from '@/shared/api/client';
import type { components } from '@/types/api';

export type SavePartQuotasRequest = components['schemas']['SaveProjectQuotaManagementRequest'];
export type SavePartQuotasResponse = components['schemas']['SaveProjectQuotaManagementResponse'];

export const savePartQuotas = (body: SavePartQuotasRequest) =>
  api.patch<SavePartQuotasResponse>('/api/v1/projects/admin/part-quotas', body);
