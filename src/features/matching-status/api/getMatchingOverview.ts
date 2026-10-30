import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-STAT-004'];

export type MatchingOverviewResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;
export type MatchingOverviewView = NonNullable<
  NonNullable<Operation['parameters']['query']>['view']
>;

/**
 * 매칭 결과 시트 (PROJECT-STAT-004): 지부 공개 프로젝트별 팀원 명단 · 파트 정원
 * view=ADJUSTMENT: 운영진 조정 명단 (최고 관리자 · 총괄단 · 해당 지부장만, 그 외 403)
 */
export const getMatchingOverview = (chapterId: number, view: MatchingOverviewView) =>
  api.get<MatchingOverviewResponse>('/api/v1/projects/statistics/matching-overview', {
    chapterId,
    view,
  });
