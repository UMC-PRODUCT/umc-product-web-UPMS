import { queryOptions } from '@tanstack/react-query';

import { getPartQuotas, type PartQuotasParams } from './getPartQuotas';

export const partQuotasQueryOptions = (params: PartQuotasParams) =>
  queryOptions({
    queryKey: ['part-quotas', params],
    queryFn: () => getPartQuotas(params),
    enabled: params.gisuId > 0,
  });
