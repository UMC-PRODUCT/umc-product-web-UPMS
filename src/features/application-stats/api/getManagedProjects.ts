import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-006_1'];

export type ManagedProjectsQuery = Operation['parameters']['query'];
export type ManagedProjectsResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 내가 관리하는 프로젝트 목록 (PM 내 프로젝트 탭) */
export const getManagedProjects = (query: ManagedProjectsQuery) =>
  api.get<ManagedProjectsResponse>('/api/v1/projects/me/managed', query);
