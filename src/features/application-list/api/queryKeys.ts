import type { ProjectsQuery } from '@/entities/project';

// 지원자 목록 쿼리 키. 배정 상태를 바꾸면 'project-applicants' 아래를 다시 불러옴
export const applicationListKeys = {
  projects: (query: ProjectsQuery | null) => ['application-list', 'projects', query] as const,
  applicants: {
    all: ['project-applicants'] as const,
    batch: (projectIds: number[]) => ['project-applicants', 'batch', projectIds] as const,
    project: (projectId: number | null) => ['project-applicants', 'project', projectId] as const,
  },
};
