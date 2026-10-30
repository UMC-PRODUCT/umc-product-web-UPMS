import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-001'];

export type ProjectsQuery = NonNullable<Operation['parameters']['query']>;
export type ProjectsResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 프로젝트 목록 조회 (검색어 · 지부 · 학교 · 파트 · 모집 상태 필터와 페이지는 서버에서 처리) */
export const getProjects = (query: ProjectsQuery) =>
  api.get<ProjectsResponse>('/api/v1/projects', query);
