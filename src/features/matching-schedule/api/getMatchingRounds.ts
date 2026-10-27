import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-MATCHING-001'];

export type MatchingRoundsQuery = NonNullable<Operation['parameters']['query']>;
export type MatchingRoundsResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 매칭 차수 목록 조회 (chapterId가 있으면 해당 지부만) */
export const getMatchingRounds = (query: MatchingRoundsQuery) =>
  api.get<MatchingRoundsResponse>('/api/v1/project/matching-rounds', query);
