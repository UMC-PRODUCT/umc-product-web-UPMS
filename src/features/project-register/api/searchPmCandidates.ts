import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['CHALLENGER-201'];

export type ChallengerSearchQuery = NonNullable<Operation['parameters']['query']>;
export type ChallengerSearchResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 챌린저 검색 (PM 후보는 PLAN 파트로 거름) */
export const searchChallengers = (query: ChallengerSearchQuery) =>
  api.get<ChallengerSearchResponse>('/api/v2/challenger/search', query);
