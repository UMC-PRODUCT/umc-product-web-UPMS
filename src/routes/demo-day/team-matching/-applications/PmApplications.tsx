import { PageHeader, Pagination, SectionHeader } from '@umc-product/react';
import { useState } from 'react';

import { useChapters } from '@/entities/chapter';
import { useSessionStore } from '@/entities/session';
import {
  APPLICATION_FILTERS,
  type ApplicationFilterKey,
  ApplicationTable,
  filterPmApplicants,
  getApplicantSchoolOptions,
  INITIAL_APPLICATION_FILTERS,
  toProjectApplicationRow,
  useProjectApplicants,
} from '@/features/application-list';
import {
  getCurrentRound,
  MyProjectTab,
  RoundProgressCard,
  toRoundProgress,
  TotalApplicantsCard,
  toTotalApplicants,
  useApplicationStatistics,
  useMyManagedProject,
} from '@/features/application-stats';
import { useProjectDetail } from '@/features/applications';
import { FilterDropdownGroup } from '@/widgets/filterDropdownGroup';
import { SearchBar } from '@/widgets/searchBar';

import { getBreadcrumbs } from '../-shared/constants';
import UpdatedAtCaption from '../-shared/UpdatedAtCaption';
import ApplicantApplicationModal from './ApplicantApplicationModal';
import { useApplicantStatusControl } from './useApplicantStatusControl';
import { useCurrentMatchingRound } from './useCurrentMatchingRound';

// 피그마: 지원자 10명씩 페이지 구분
const APPLICANTS_PER_PAGE = 10;

// 마지막으로 불러온 시각. 불러오지 못했을 때도 마지막 요청 시각
const lastFetchedAt = (...queries: { dataUpdatedAt: number; errorUpdatedAt: number }[]) =>
  Math.max(
    ...queries.flatMap(({ dataUpdatedAt, errorUpdatedAt }) => [dataUpdatedAt, errorUpdatedAt]),
  );

// PM 챌린저 뷰: 내 프로젝트의 지원 현황만
const PmApplications = () => {
  const { gisuId, serverChapterId: chapterId } = useSessionStore((state) => state.session);
  const { data: chapters = [] } = useChapters(gisuId);
  const chapterName = chapters.find(({ id }) => id === chapterId)?.name ?? '';

  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState(INITIAL_APPLICATION_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);

  // 내 프로젝트 (진행 중). 로고 · 보조 PM은 프로젝트 상세에서
  const managedProject = useMyManagedProject(gisuId);
  const project = managedProject.data ? toProjectApplicationRow(managedProject.data) : null;
  const projectId = project?.projectId ?? null;
  const { data: detail } = useProjectDetail(projectId);

  // 01 내 프로젝트 지원 통계: 지금 매칭 종류(Plan-Design · Plan-PE)와 차수만
  const statistics = useApplicationStatistics(
    projectId === null ? null : { projectIds: [projectId] },
  );
  // 지금 매칭 종류 · 차수는 서버가 알려 준 값을 쓰고, 진행 중인 차수가 없으면 지부 일정으로 정함
  const scheduleRound = useCurrentMatchingRound(chapterId);
  const current = (statistics.data && getCurrentRound(statistics.data)) ?? scheduleRound;

  // 02 지원자 목록: 프로젝트 하나라 전체를 받아 화면에서 검색 · 필터 · 페이지를 나눔
  const applicants = useProjectApplicants(projectId);
  const allApplicants = applicants.data ?? [];
  const filteredApplicants = filterPmApplicants(allApplicants, keyword, filters);
  const totalPages = Math.max(1, Math.ceil(filteredApplicants.length / APPLICANTS_PER_PAGE));
  const selectedApplicant =
    allApplicants.find(({ applicantId }) => applicantId === selectedApplicantId) ?? null;
  // 배정 상태 변경 (담당 PM은 서버 권한이 있음. 결정 기간인 차수만)
  const statusControl = useApplicantStatusControl(chapterId, projectId === null ? [] : [projectId]);

  // 학교 필터는 지원자들의 학교
  const filterDropdowns = APPLICATION_FILTERS.map((filter) =>
    filter.key === 'school'
      ? { ...filter, options: getApplicantSchoolOptions(allApplicants) }
      : filter,
  );

  // 검색어 · 필터를 바꾸면 첫 페이지부터
  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setPage(1);
  };
  const handleFilterChange = (key: ApplicationFilterKey, value: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const pageHeader = (
    <PageHeader
      className="w-full max-w-[1152px]"
      breadcrumbs={getBreadcrumbs('지원 현황')}
      title="지원 현황"
      description="프로젝트별 지원 내역과 지원 현황을 확인하고 관리할 수 있어요."
    />
  );

  // TODO: 불러오기 실패 · 진행 중 프로젝트 없음 화면이 피그마에 나오면 교체
  if (managedProject.isError || (managedProject.isSuccess && !project)) {
    return (
      <main className="flex flex-col items-start gap-8 px-8 pt-12 pb-20">
        {pageHeader}
        <p role="alert" className="text-body-3-medium text-red-500">
          {managedProject.isError
            ? '내 프로젝트를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
            : '내가 PM인 프로젝트가 없어요.'}
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-start gap-8 px-8 pt-12 pb-20">
      {pageHeader}
      {/* 처음 불러오는 동안은 빈 화면이 잠깐 보이지 않도록 그리지 않음 */}
      {project && (
        <div className="flex w-full max-w-[1084px] flex-col">
          <MyProjectTab
            projectName={project.projectName}
            logoUrl={detail?.logoUrl ?? null}
            pmName={project.challengerName}
            schoolName={project.schoolName}
          />

          <div className="flex w-full max-w-[1076px] flex-col gap-16 rounded-xl px-6 pt-7 pb-8">
            <section className="flex w-full flex-col gap-4">
              <SectionHeader
                number="01"
                title="내 프로젝트 지원 통계"
                slot={<UpdatedAtCaption updatedAt={lastFetchedAt(statistics)} />}
              />
              {statistics.isError && (
                <p role="alert" className="text-body-3-medium text-red-500">
                  지원 통계를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
                </p>
              )}
              {statistics.data && (
                // 피그마: 두 카드가 562 : 466 비율로 섹션 폭을 채움 (사이 16px)
                <div className="flex w-full items-stretch gap-4">
                  <div className="min-w-0 flex-[562_1_0]">
                    <RoundProgressCard
                      title="매칭 차수별 지원률"
                      {...toRoundProgress(statistics.data, current.type, current.round)}
                    />
                  </div>
                  <div className="min-w-0 flex-[466_1_0]">
                    <TotalApplicantsCard {...toTotalApplicants(statistics.data, current.round)} />
                  </div>
                </div>
              )}
            </section>

            <div className="flex w-full flex-col items-center gap-10">
              <section className="flex w-full flex-col gap-4">
                <SectionHeader
                  number="02"
                  title="지원자 목록"
                  slot={<UpdatedAtCaption updatedAt={lastFetchedAt(applicants)} />}
                />
                <div className="flex w-full flex-col gap-5">
                  <div className="flex w-full items-start justify-between gap-4">
                    <SearchBar
                      value={keyword}
                      onValueChange={handleKeywordChange}
                      placeholder="닉네임/이름으로 검색하세요."
                      className="w-[456px]"
                    />
                    <FilterDropdownGroup
                      filters={filterDropdowns}
                      keys={['school', 'part', 'round']}
                      values={filters}
                      onValueChange={handleFilterChange}
                    />
                  </div>
                  {applicants.isError && (
                    <p role="alert" className="text-body-3-medium text-red-500">
                      지원자 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
                    </p>
                  )}
                  {/* 지원 마감 전 차수의 지원자 실시간 노출은 담당 PM · 보조 PM만 (서버 규칙) */}
                  <ApplicationTable
                    view="PM_CHALLENGER"
                    groups={[
                      {
                        project,
                        coPms: detail?.coPms ?? [],
                        applicants: filteredApplicants.slice(
                          (page - 1) * APPLICANTS_PER_PAGE,
                          page * APPLICANTS_PER_PAGE,
                        ),
                      },
                    ]}
                    onApplicantClick={(_, { applicantId }) => setSelectedApplicantId(applicantId)}
                  />
                </div>
              </section>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </div>
        </div>
      )}
      {/* PM은 프로젝트 상세 없이 지원서만 바로 띄움 */}
      {project && (
        <ApplicantApplicationModal
          project={project}
          applicant={selectedApplicant}
          chapterName={chapterName}
          onClose={() => setSelectedApplicantId(null)}
          onStatusChange={statusControl.changeStatus(project.projectId)}
          canChangeStatus={
            selectedApplicant !== null &&
            statusControl.canChangeStatus(project.projectId)(selectedApplicant)
          }
          isUpdatingStatus={statusControl.isUpdating}
        />
      )}
    </main>
  );
};

export default PmApplications;
