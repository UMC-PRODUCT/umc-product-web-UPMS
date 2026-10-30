import { api } from '@/shared/api/client';
import type { components, operations } from '@/types/api';

type Operation = operations['PROJECT-QUOTAS-001'];

export type PartQuotasResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;
export type Column = NonNullable<components['schemas']['Column']>;
export type PartSummary = NonNullable<components['schemas']['PartSummary']>;
export type ProjectRow = NonNullable<components['schemas']['ProjectRow']>;
export type Cell = NonNullable<components['schemas']['Cell']>;
export type Totals = NonNullable<components['schemas']['Totals']>;

export type PartQuotasParams = NonNullable<Operation['parameters']['query']>;

export const getPartQuotas = (params: PartQuotasParams) =>
  api.get<PartQuotasResponse>('/api/v1/projects/admin/part-quotas', params);
