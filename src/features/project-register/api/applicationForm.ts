import { api } from '@/shared/api/client';
import type { components } from '@/types/api';

export type ApplicationFormResponse = components['schemas']['GetApplicationFormResponse'];
export type UpsertApplicationFormRequest = components['schemas']['UpsertApplicationFormRequest'];

/** 지원 폼 조회 (폼이 없으면 null) */
export const getApplicationForm = (projectId: number) =>
  api.get<ApplicationFormResponse | null>(`/api/v1/projects/${projectId}/application-form`);

/** 지원 폼 저장 (본문이 폼의 새 전체 상태) */
export const saveApplicationForm = (projectId: number, body: UpsertApplicationFormRequest) =>
  api.put<unknown>(`/api/v1/projects/${projectId}/application-form`, body);
