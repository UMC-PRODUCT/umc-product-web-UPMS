import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-006_1'];

export type ManagedProjectsResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 내가 관리하는 프로젝트 목록 (PM은 본인 프로젝트) */
export const getManagedProjects = (gisuId: number) =>
  api.get<ManagedProjectsResponse>('/api/v1/projects/me/managed', { gisuId, size: 1 });
