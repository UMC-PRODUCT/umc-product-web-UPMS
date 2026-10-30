import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['APPLY-004'];

export type MyApplicationsQuery = Operation['parameters']['query'];
export type MyApplicationsResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 본인 지원 내역 목록 조회 (챌린저 내 지원 현황) */
export const getMyApplications = (query: MyApplicationsQuery) =>
  api.get<MyApplicationsResponse>('/api/v1/projects/me/applications', query);
