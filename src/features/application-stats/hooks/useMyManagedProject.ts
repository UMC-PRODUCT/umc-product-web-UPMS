import { skipToken, useQuery } from '@tanstack/react-query';

import { getManagedProjects } from '../api/getManagedProjects';

// PM이 맡은 이번 기수 프로젝트 하나 (없으면 null). 기수를 모르면 부르지 않음
// 서버가 진행 중 → 승인대기 → 임시저장 순으로 정렬해 주므로 첫 프로젝트를 씀
// (상태 값이 문서와 실제 응답이 달라서(IN_PROGRESS · ACTIVE) 상태로 거르지 않음)
// TODO: 백엔드에 문서 · 응답 상태 값 맞춰 달라고 요청
export const useMyManagedProject = (gisuId: number | null) =>
  useQuery({
    queryKey: ['application-stats', 'managed-project', gisuId],
    queryFn: gisuId === null ? skipToken : () => getManagedProjects({ gisuId }),
    select: ({ content = [] }) => content[0] ?? null,
  });
