import type { Project, ProjectFilterValues } from './types';

const includesOrEmpty = (selected: string[], value: string) =>
  selected.length === 0 || selected.includes(value);

// 모집 중인 파트가 하나라도 있으면 모집 중, 전 파트가 마감이면 모집 완료
const getRecruitStatus = ({ recruitments }: Project) =>
  recruitments.some(({ status }) => status === 'RECRUITING') ? 'RECRUITING' : 'CLOSED';

const PLATFORM_FILTER_VALUE: Record<Project['platform'], string> = {
  WEB: 'Web',
  MOBILE: 'Mobile',
};

// 프로젝트 이름 검색 + 지부 · PM 학교 · 파트(서비스 플랫폼) · 모집 상태 필터. 같은 필터 안에서는 OR, 필터끼리는 AND
export const filterProjects = (
  projects: Project[],
  keyword: string,
  filters: ProjectFilterValues,
): Project[] => {
  const trimmedKeyword = keyword.trim().toLowerCase();

  return projects.filter(
    (project) =>
      project.projectName.toLowerCase().includes(trimmedKeyword) &&
      includesOrEmpty(filters.chapter, project.chapterId) &&
      includesOrEmpty(filters.school, project.schoolName) &&
      includesOrEmpty(filters.part, PLATFORM_FILTER_VALUE[project.platform]) &&
      includesOrEmpty(filters.recruitStatus, getRecruitStatus(project)),
  );
};
