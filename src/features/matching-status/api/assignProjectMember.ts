import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-402'];

export type AssignProjectMemberBody = Operation['requestBody']['content']['application/json'];

/** 운영진 수동 배정 (차수 · 마감과 관계없이 즉시 배정. 정원 초과 · 중복 배정은 서버가 거절) */
export const assignProjectMember = (projectId: number, body: AssignProjectMemberBody) =>
  api.post<unknown>(`/api/v1/projects/admin/${projectId}/members`, body);
