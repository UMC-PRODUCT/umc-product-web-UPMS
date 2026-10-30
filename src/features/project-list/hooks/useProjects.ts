import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getProjects } from '../api/getProjects';
import { toProject } from '../lib/toProject';
import { toProjectsQuery } from '../lib/toProjectsQuery';
import type { ProjectFilterValues } from '../model/types';

type UseProjectsParams = {
  gisuId: number | null;
  keyword: string;
  filters: ProjectFilterValues;
  page: number; // 1부터
};

// 기수의 프로젝트 목록. 검색어 · 필터 · 페이지는 서버에서 처리
// 기수를 모르면(내 정보에 현재 기수가 없으면) 부르지 않음. 페이지를 넘길 때 이전 목록을 유지해 깜빡이지 않음
export const useProjects = ({ gisuId, keyword, filters, page }: UseProjectsParams) => {
  const chapterId = filters.chapter[0] ?? null;

  return useQuery({
    queryKey: ['projects', gisuId, keyword.trim(), filters, page],
    queryFn: () =>
      getProjects(toProjectsQuery({ gisuId: gisuId as number, keyword, filters, page })),
    enabled: gisuId !== null,
    placeholderData: keepPreviousData,
    select: ({ content, totalPages }) => ({
      projects: (content ?? []).map((project) => toProject(project, chapterId)),
      totalPages: Math.max(1, totalPages ?? 1),
    }),
  });
};
