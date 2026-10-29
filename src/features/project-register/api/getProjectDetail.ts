import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-002'];

export type ProjectDetailResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 프로젝트 상세 조회 (이어 쓸 초안의 파트별 정원) */
export const getProjectDetail = (projectId: number) =>
  api.get<ProjectDetailResponse>(`/api/v1/projects/${projectId}`);
