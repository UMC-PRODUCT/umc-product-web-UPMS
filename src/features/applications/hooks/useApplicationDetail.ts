import { skipToken, useQuery } from '@tanstack/react-query';

import { getApplicationDetail } from '../api/getApplicationDetail';
import { applicationKeys } from '../api/queryKeys';
import { toApplicationSections } from '../model/toApplicationSections';

type ApplicationTarget = { projectId: number; applicationId: number };

// 지원서 상세를 지원서 화면 섹션으로. target이 null이면(지원서를 열지 않았으면) 부르지 않음
export const useApplicationDetail = (target: ApplicationTarget | null) =>
  useQuery({
    queryKey: applicationKeys.detail(target?.projectId ?? null, target?.applicationId ?? null),
    queryFn: target === null ? skipToken : () => getApplicationDetail(target),
    select: toApplicationSections,
  });
