import { skipToken, useQuery } from '@tanstack/react-query';

import {
  type ApplicationStatisticsQuery,
  getApplicationStatistics,
} from '../api/getApplicationStatistics';

// 지원 통계 (서버 응답 그대로). 카드 · 차트는 화면에서 변환 함수로 바꿈
// 어드민은 지부(chapterId), PM은 내 프로젝트(projectIds)로 조회. 조건을 모르면(null) 부르지 않음
export const useApplicationStatistics = (query: ApplicationStatisticsQuery | null) =>
  useQuery({
    queryKey: ['application-stats', query],
    queryFn: query === null ? skipToken : () => getApplicationStatistics(query),
  });
