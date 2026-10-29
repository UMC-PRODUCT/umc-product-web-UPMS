import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-STAT-003'];

export type ChapterMatchingStatisticsResponse = NonNullable<
  Operation['responses'][200]['content']['*/*']
>;

/** 지부 공개 프로젝트 매칭 요약 조회 (진행 중 · 완료 프로젝트의 차수별 · 학교별 · 프로젝트별 매칭 인원) */
export const getChapterMatchingStatistics = (chapterId: number) =>
  api.get<ChapterMatchingStatisticsResponse>('/api/v1/projects/statistics/matchings', {
    chapterId,
  });
