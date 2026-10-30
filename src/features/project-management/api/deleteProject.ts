import { api } from '@/shared/api/client';

export const deleteProject = (projectId: string) =>
  api.delete<void>(`/api/v1/projects/${projectId}`);
