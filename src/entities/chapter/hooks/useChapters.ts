import { useQuery } from '@tanstack/react-query';

import { getChapters } from '../api/getChapters';
import { toChapterSummaries } from '../lib/toChapterSummaries';

// 기수의 지부 목록. 기수를 모르면(내 정보에 현재 기수가 없으면) 부르지 않음
export const useChapters = (gisuId: number | null) =>
  useQuery({
    queryKey: ['chapters', gisuId],
    queryFn: () => getChapters(gisuId as number),
    enabled: gisuId !== null,
    select: toChapterSummaries,
  });
