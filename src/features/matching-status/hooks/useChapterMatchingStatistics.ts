import { skipToken, useQuery } from '@tanstack/react-query';

import { getChapterMatchingStatistics } from '../api/getChapterMatchingStatistics';

// 지부 매칭 통계 (서버 응답 그대로). 카드 · 차트마다 필요한 모양이 달라 화면에서 바꿈
// 지부를 모르면 부르지 않음
export const useChapterMatchingStatistics = (chapterId: number | null) =>
  useQuery({
    queryKey: ['matching-status', 'statistics', chapterId],
    queryFn: chapterId === null ? skipToken : () => getChapterMatchingStatistics(chapterId),
  });
