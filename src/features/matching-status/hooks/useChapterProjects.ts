import { skipToken, useQuery } from '@tanstack/react-query';

import { getProjects } from '@/entities/project';

// 매칭 통계 · 결과 시트에 쓸 지부의 공개 프로젝트 (이름 · 파트 정원). 한 번에 최대 100개
// 매칭 통계와 같은 기준으로 진행 중 · 완료 프로젝트만. 기수 · 지부를 모르면 부르지 않음
const MAX_PROJECTS = 100;

export const useChapterProjects = (gisuId: number | null, chapterId: number | null) =>
  useQuery({
    queryKey: ['matching-status', 'projects', gisuId, chapterId],
    queryFn:
      gisuId === null || chapterId === null
        ? skipToken
        : () =>
            getProjects({
              gisuId,
              chapterId,
              statuses: ['IN_PROGRESS', 'COMPLETED'],
              page: 0,
              size: MAX_PROJECTS,
            }),
    select: ({ content = [] }) => content,
  });
