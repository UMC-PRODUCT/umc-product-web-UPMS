import { keepPreviousData, skipToken, useQuery } from '@tanstack/react-query';

import { getProjects, type ProjectsQuery } from '@/entities/project';

import { applicationListKeys } from '../api/queryKeys';
import { toProjectApplicationRow } from '../model/toProjectApplicationRow';

// 지원자 목록 표의 프로젝트 줄 (한 페이지). query가 null이면(기수 · 지부를 모르면) 부르지 않음
// 페이지 · 필터를 바꾸는 동안 이전 페이지를 그대로 보여 줘서 표가 깜빡이지 않음
export const useApplicationProjects = (query: ProjectsQuery | null) =>
  useQuery({
    queryKey: applicationListKeys.projects(query),
    queryFn: query === null ? skipToken : () => getProjects(query),
    placeholderData: keepPreviousData,
    select: ({ content = [], totalPages = 0 }) => ({
      rows: content.flatMap((project) => toProjectApplicationRow(project) ?? []),
      totalPages: Math.max(1, totalPages),
    }),
  });
