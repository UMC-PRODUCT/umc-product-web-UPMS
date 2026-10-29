import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-001'];

export type ProjectsQuery = Operation['parameters']['query'];
export type ProjectsResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 프로젝트 목록 조회 (어드민 지원자 목록 표의 프로젝트 줄. 검색 · 필터 · 페이지는 서버에서) */
export const getProjects = ({ schoolIds, parts, statuses, sort, ...query }: ProjectsQuery) =>
  api.get<ProjectsResponse>('/api/v1/projects', {
    ...query,
    // axios 기본값은 배열을 schoolIds[]=1&schoolIds[]=2로 보내서 서버가 못 읽음. 쉼표로 이어 보냄
    ...(schoolIds?.length && { schoolIds: schoolIds.join(',') }),
    ...(parts?.length && { parts: parts.join(',') }),
    ...(statuses?.length && { statuses: statuses.join(',') }),
    ...(sort?.length && { sort: sort.join(',') }),
  });
