import { api } from '@/shared/api/client';
import type { components, operations } from '@/types/api';

type Operation = operations['PROJECT-101'];

export type CreateDraftProjectRequest = components['schemas']['CreateDraftProjectRequest'];
export type ProjectStatusResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 프로젝트 초안 생성 (PM 본인 또는 운영진이 PM을 지정해 대리 등록) */
export const createDraftProject = (body: CreateDraftProjectRequest) =>
  api.post<ProjectStatusResponse>('/api/v1/projects', body);
