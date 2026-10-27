import { useQuery } from '@tanstack/react-query';
import { PageHeader, Pagination } from '@umc-product/react';
import { useMemo, useState } from 'react';

import { useApplicationsView, useSessionStore } from '@/entities/session';
import {
  filterProjects,
  getProjectActions,
  getSchoolOptions,
  INITIAL_PROJECT_FILTERS,
  MOCK_PROJECT_VIEWER,
  MOCK_PROJECTS,
  PROJECT_FILTERS,
  PROJECT_LIST_GRID_CLASS,
  type ProjectFilterKey,
  ProjectListCard,
  ProjectListEmpty,
  ProjectListSkeleton,
} from '@/features/project-list';
import { FilterDropdownGroup } from '@/widgets/filterDropdownGroup';
import { SearchBar } from '@/widgets/searchBar';

import { getBreadcrumbs } from '../-shared/constants';
import ProjectDetailModal from './ProjectDetailModal';
import { useProjectPeriod } from './useProjectPeriod';

// 피그마: 한 페이지에 카드 3열 × 4줄
const PROJECTS_PER_PAGE = 12;

// 프로젝트 목록: 주소는 하나, 권한(뷰)과 지원 · 매칭 기간에 따라 상세 모달 버튼만 달라짐
// 프로젝트 조회는 어드민 · 챌린저 상관없이 전 지부를 볼 수 있음
const ProjectListPage = () => {
  const session = useSessionStore((state) => state.session);
  const view = useApplicationsView();
  const period = useProjectPeriod(session, view, MOCK_PROJECT_VIEWER);
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState(INITIAL_PROJECT_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // TODO: 프로젝트 목록 API 연동 (검색어 · 필터 · 페이지는 서버에서 처리). 지금은 mock 전체를 받아 화면에서 거름
  const { data: projects = [], isPending } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => MOCK_PROJECTS,
  });

  const filteredProjects = useMemo(
    () => filterProjects(projects, keyword, filters),
    [projects, keyword, filters],
  );
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE));
  const pageProjects = filteredProjects.slice(
    (page - 1) * PROJECTS_PER_PAGE,
    page * PROJECTS_PER_PAGE,
  );
  const selectedProject = projects.find(({ projectId }) => projectId === selectedProjectId) ?? null;

  // PM 학교 목록은 고른 지부의 학교만
  const filterDropdowns = useMemo(
    () =>
      PROJECT_FILTERS.map((filter) =>
        filter.key === 'school'
          ? { ...filter, options: getSchoolOptions(filters.chapter) }
          : filter,
      ),
    [filters.chapter],
  );

  const handleFilterChange = (key: ProjectFilterKey, value: string[]) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'chapter') {
        // 다른 지부로 바꾸면 그 지부에 없는 학교 선택은 해제
        const schools = getSchoolOptions(value).map((option) => option.value);
        next.school = prev.school.filter((school) => schools.includes(school));
      }
      return next;
    });
    setPage(1);
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  return (
    <main className="flex flex-col items-start gap-8 px-8 pt-12 pb-20">
      <PageHeader
        className="w-full max-w-[1152px]"
        breadcrumbs={getBreadcrumbs('프로젝트 목록')}
        title="프로젝트 목록"
        description="등록된 11기의 프로젝트를 확인해요."
      />
      <div className="flex w-full max-w-[1158px] flex-col gap-8">
        <div className="flex w-full items-start justify-between gap-4">
          <SearchBar
            value={keyword}
            onValueChange={handleKeywordChange}
            placeholder="프로젝트 명으로 검색하세요"
            className="w-[456px]"
          />
          <FilterDropdownGroup
            filters={filterDropdowns}
            values={filters}
            onValueChange={handleFilterChange}
          />
        </div>
        {isPending ? (
          <ProjectListSkeleton count={PROJECTS_PER_PAGE} />
        ) : filteredProjects.length === 0 ? (
          <ProjectListEmpty />
        ) : (
          <div className="flex w-full flex-col gap-10">
            <div className={PROJECT_LIST_GRID_CLASS}>
              {pageProjects.map((project) => (
                <ProjectListCard
                  period={period}
                  key={project.projectId}
                  project={project}
                  onClick={() => setSelectedProjectId(project.projectId)}
                />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="self-center"
            />
          </div>
        )}
      </div>
      <ProjectDetailModal
        project={selectedProject}
        period={period}
        actions={
          selectedProject &&
          getProjectActions({
            role: session.role,
            chapterId: session.chapterId,
            view,
            project: selectedProject,
            period,
            viewer: MOCK_PROJECT_VIEWER,
          })
        }
        onClose={() => setSelectedProjectId(null)}
      />
    </main>
  );
};

export default ProjectListPage;
