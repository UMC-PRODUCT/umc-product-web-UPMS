import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-003'];

export type ProjectMembersResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 프로젝트 팀원 구성 조회 (파트별 매칭된 팀원과 매칭 차수) */
export const getProjectMembers = (projectId: number) =>
  api.get<ProjectMembersResponse>(`/api/v1/projects/${projectId}/members`);
