import { api } from '@/shared/api/client';
import type { components } from '@/types/api';

export type UpdateProjectRequest = components['schemas']['UpdateProjectRequest'];

/** 프로젝트 기본정보 부분 수정 (보낸 필드만 바뀜) */
export const updateProject = (projectId: number, body: UpdateProjectRequest) =>
  api.patch<unknown>(`/api/v1/projects/${projectId}`, body);
