import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['APPLY-004'];

export type MyApplicationsResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 본인 지원 내역 조회 (지원서 + 랜덤 매칭 배정) */
export const getMyApplications = (gisuId: number) =>
  api.get<MyApplicationsResponse>('/api/v1/projects/me/applications', { gisuId });
