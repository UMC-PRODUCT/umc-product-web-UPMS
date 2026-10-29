import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['MEMBER-202'];

export type MemberSearchQuery = NonNullable<Operation['parameters']['query']>;
export type MemberSearchResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 회원 검색 (PM 후보는 PLAN 파트로 거름) */
export const searchMembers = (query: MemberSearchQuery) =>
  api.get<MemberSearchResponse>('/api/v2/member/search', query);
