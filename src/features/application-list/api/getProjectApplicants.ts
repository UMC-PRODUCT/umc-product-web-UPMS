import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['APPLY-101'];

export type ProjectApplicantsQuery = NonNullable<Operation['parameters']['query']>;
export type ProjectApplicantsResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** PM · 운영진 단일 프로젝트 지원자 목록 조회 (PM 지원자 목록, 어드민 프로젝트 상세) */
export const getProjectApplicants = (projectId: number, query?: ProjectApplicantsQuery) =>
  api.get<ProjectApplicantsResponse>(`/api/v1/projects/${projectId}/applications`, query);
