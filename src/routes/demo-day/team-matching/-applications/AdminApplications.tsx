import { PageHeader, Pagination } from '@umc-product/react';
import { useState } from 'react';

import { useCanEditApplicantStatus, useSessionStore } from '@/entities/session';
import {
  type ApplicantStatus,
  APPLICATION_FILTERS,
  ApplicationTable,
  INITIAL_APPLICATION_FILTERS,
  MOCK_PROJECT_APPLICATION_GROUPS,
} from '@/features/application-list';
import {
  MOCK_PROJECT_APPLICATIONS,
  MOCK_ROUND_PROGRESS,
  MOCK_TOTAL_APPLICANTS,
  ProjectApplicationsChart,
  RoundProgressCard,
  TotalApplicantsCard,
} from '@/features/application-stats';
import { ChapterSelectHeader, useVisibleChapters } from '@/features/chapter-select';
import { SectionTitle } from '@/shared/ui/SectionTitle';
import { FilterDropdownGroup } from '@/widgets/filterDropdownGroup';
import { SearchBar } from '@/widgets/searchBar';

import { getBreadcrumbs, UPDATED_AT_CAPTION } from './constants';
import ProjectApplicantsModal from './ProjectApplicantsModal';

// 프로젝트 10개씩 페이지 구분 (PM 뷰 지원자 기준과 같게)
const PROJECTS_PER_PAGE = 10;

// 어드민 뷰: 지부별 지원 통계 + 전체 프로젝트 지원 목록
const AdminApplications = () => {
  const ownChapterId = useSessionStore((state) => state.session.chapterId);
  const chapters = useVisibleChapters();
  // 기본 선택: 소속 지부, 없으면 첫 번째 지부
  const [chapterId, setChapterId] = useState(
    () => chapters.find((chapter) => chapter.id === ownChapterId)?.id ?? chapters[0]?.id ?? '',
  );
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState(INITIAL_APPLICATION_FILTERS);
  const [page, setPage] = useState(1);
  // TODO: 지원 목록 API 연동 후 서버 데이터로 교체
  const [groups, setGroups] = useState(MOCK_PROJECT_APPLICATION_GROUPS);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const selectedGroup = groups.find(({ project }) => project.projectId === selectedProjectId);
  // TODO: API 연동 시 프로젝트의 소속 지부로 교체
  const chapterName = chapters.find((chapter) => chapter.id === chapterId)?.name ?? '';
  // 학교 운영진은 조회만, 지부장은 본인 지부 프로젝트만 배정 상태를 바꿀 수 있음
  const canEditStatus = useCanEditApplicantStatus(chapterId);

  // TODO: 배정 상태 변경 API 연동. 지금은 화면에서만 바꾸고 처리 시각을 현재로 갱신
  const handleStatusChange = (applicantId: string, status: ApplicantStatus) => {
    const processedAt = new Date().toISOString();
    setGroups((prev) =>
      prev.map((group) =>
        group.project.projectId === selectedProjectId
          ? {
              ...group,
              applicants: group.applicants.map((applicant) =>
                applicant.applicantId === applicantId
                  ? { ...applicant, status, processedAt }
                  : applicant,
              ),
            }
          : group,
      ),
    );
  };

  // TODO: API 연동 시 서버 페이지네이션으로 교체
  const totalPages = Math.max(1, Math.ceil(groups.length / PROJECTS_PER_PAGE));
  const pageGroups = groups.slice((page - 1) * PROJECTS_PER_PAGE, page * PROJECTS_PER_PAGE);

  return (
    <main className="flex flex-col items-start gap-8 px-8 pt-12 pb-20">
      <PageHeader
        className="w-full max-w-[1152px]"
        breadcrumbs={getBreadcrumbs('지원 현황')}
        title="지원 현황"
        description="프로젝트별 지원 내역과 지원 현황을 확인하고 관리할 수 있어요."
      />
      <div className="flex w-full max-w-[1060px] flex-col gap-8">
        <ChapterSelectHeader value={chapterId} onValueChange={setChapterId} />

        <div className="flex w-full flex-col gap-16">
          <section className="flex w-full flex-col gap-4">
            <SectionTitle size="lg" order="01" title="지원 통계" caption={UPDATED_AT_CAPTION} />
            <div className="flex w-full flex-col gap-4">
              <div className="flex w-full items-start gap-6">
                <div className="w-[581px] shrink-0">
                  <RoundProgressCard {...MOCK_ROUND_PROGRESS} />
                </div>
                <div className="w-[348px] shrink-0">
                  <TotalApplicantsCard {...MOCK_TOTAL_APPLICANTS} />
                </div>
              </div>
              <ProjectApplicationsChart projects={MOCK_PROJECT_APPLICATIONS} />
            </div>
          </section>

          <section className="flex w-full flex-col gap-4">
            <SectionTitle size="lg" order="02" title="지원자 목록" caption={UPDATED_AT_CAPTION} />
            <div className="flex w-full flex-col gap-5">
              <div className="flex w-full items-start justify-between gap-4">
                <SearchBar
                  value={keyword}
                  onValueChange={setKeyword}
                  placeholder="{프로젝트 명}으로 검색하세요"
                  className="w-[456px]"
                />
                <FilterDropdownGroup
                  filters={APPLICATION_FILTERS}
                  keys={['school', 'part', 'round', 'recruitStatus', 'applyStatus']}
                  values={filters}
                  onValueChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
                />
              </div>
              {/* TODO: 검색어 · 필터 API 연동 */}
              <ApplicationTable
                view="ADMIN"
                groups={pageGroups}
                onProjectClick={({ project }) => setSelectedProjectId(project.projectId)}
              />
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-6 self-center"
            />
          </section>
        </div>
      </div>
      <ProjectApplicantsModal
        group={selectedGroup ?? null}
        chapterName={chapterName}
        onClose={() => setSelectedProjectId(null)}
        onStatusChange={canEditStatus ? handleStatusChange : undefined}
      />
    </main>
  );
};

export default AdminApplications;
