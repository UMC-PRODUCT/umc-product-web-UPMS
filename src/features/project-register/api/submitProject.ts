import { api } from '@/shared/api/client';

/** 프로젝트 제출 (임시저장 → 승인 대기) */
export const submitProject = (projectId: number) =>
  api.post<unknown>(`/api/v1/projects/${projectId}/submit`);
