import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-401'];

export type MatchingCandidatesQuery = NonNullable<Operation['parameters']['query']>;
export type MatchingCandidatesResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 수동 배정 후보 조회 (프로젝트의 매칭 지부 · 파트별 미배정 챌린저) */
export const getMatchingCandidates = (projectId: number, query: MatchingCandidatesQuery) =>
  api.get<MatchingCandidatesResponse>(
    `/api/v1/projects/admin/${projectId}/members/candidates`,
    query,
  );
