import { PageHeader, Pagination } from '@umc-product/react';
import { useEffect, useState } from 'react';

import { useApplicationsView, useSessionStore } from '@/entities/session';
import {
  getProjectActions,
  INITIAL_PROJECT_FILTERS,
  PROJECT_LIST_GRID_CLASS,
  type ProjectFilterKey,
  ProjectListCard,
  ProjectListEmpty,
  ProjectListSkeleton,
  PROJECTS_PER_PAGE,
  useProjectFilters,
  useProjects,
  useProjectViewer,
  useProjectWithDetail,
} from '@/features/project-list';
import { FilterDropdownGroup } from '@/widgets/filterDropdownGroup';
import { SearchBar } from '@/widgets/searchBar';

import { getBreadcrumbs } from '../-shared/constants';
import ProjectDetailModal from './ProjectDetailModal';
import { useProjectPeriod } from './useProjectPeriod';

// 검색어를 입력하는 동안은 조회하지 않고, 멈추면 조회
const KEYWORD_DEBOUNCE_MS = 300;

// 프로젝트 목록: 주소는 하나, 권한(뷰)과 지원 · 매칭 기간에 따라 상세 모달 버튼만 달라짐
// 프로젝트 조회는 어드민 · 챌린저 상관없이 전 지부를 볼 수 있음
const ProjectListPage = () => {
  const session = useSessionStore((state) => state.session);
  const view = useApplicationsView();
  const viewer = useProjectViewer(session, view);
  const period = useProjectPeriod(session, view, viewer);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filters, setFilters] = useState(INITIAL_PROJECT_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(keyword);
      setPage(1);
    }, KEYWORD_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [keyword]);

  const { data, isPending } = useProjects({
    gisuId: session.gisuId,
    keyword: searchKeyword,
    filters,
    page,
  });
  const projects = data?.projects ?? [];
  const totalPages = data?.totalPages ?? 1;

  const selectedProject = useProjectWithDetail(
    projects.find(({ projectId }) => projectId === selectedProjectId) ?? null,
  );
  const filterDropdowns = useProjectFilters(session.gisuId);

  const handleFilterChange = (key: ProjectFilterKey, value: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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
            onValueChange={setKeyword}
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
        ) : projects.length === 0 ? (
          <ProjectListEmpty />
        ) : (
          <div className="flex w-full flex-col gap-10">
            <div className={PROJECT_LIST_GRID_CLASS}>
              {projects.map((project) => (
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
            // 프로젝트 지부는 서버 지부 ID(문자열)라 사용자 소속도 서버 지부로 비교
            chapterId: session.serverChapterId === null ? null : String(session.serverChapterId),
            view,
            project: selectedProject,
            period,
            viewer,
          })
        }
        onClose={() => setSelectedProjectId(null)}
      />
    </main>
  );
};

export default ProjectListPage;
