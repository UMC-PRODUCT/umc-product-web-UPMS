import { skipToken, useQuery } from '@tanstack/react-query';

import { getMatchingOverview, type MatchingOverviewView } from '../api/getMatchingOverview';
import { toMatchingResults } from '../model/toMatchingResults';

// 매칭 결과 시트 (서비스 플랫폼별). 수동 배정 · 해제를 하는 운영진은 조정 중인 명단(ADJUSTMENT)을 봄
// 지부를 모르면 부르지 않음
export const useMatchingOverview = (chapterId: number | null, view: MatchingOverviewView) =>
  useQuery({
    queryKey: ['matching-status', 'overview', chapterId, view],
    queryFn: chapterId === null ? skipToken : () => getMatchingOverview(chapterId, view),
    select: ({ projects = [] }) => toMatchingResults(projects),
  });
