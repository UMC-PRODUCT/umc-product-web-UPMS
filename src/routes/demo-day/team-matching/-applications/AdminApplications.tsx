import { PageHeader, Pagination, SectionHeader } from '@umc-product/react';
import { useState } from 'react';

import { useChapters } from '@/entities/chapter';
import { getApplicationsAccess, getChapterScope, useSessionStore } from '@/entities/session';
import {
  APPLICATION_FILTERS,
  type ApplicationFilterKey,
  ApplicationTable,
  INITIAL_APPLICATION_FILTERS,
  type ProjectApplicationGroup,
  toProjectsQuery,
  useApplicationProjects,
  useProjectsApplicants,
  useProjectsCoPms,
} from '@/features/application-list';
import {
  getCurrentRound,
  ProjectApplicationsChart,
  RoundProgressCard,
  toProjectApplications,
  toRoundProgress,
  TotalApplicantsCard,
  toTotalApplicants,
  useApplicationStatistics,
} from '@/features/application-stats';
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';
import { FilterDropdownGroup } from '@/widgets/filterDropdownGroup';
import { SearchBar } from '@/widgets/searchBar';
import { useAppToast } from '@/widgets/toast';

import { getBreadcrumbs } from '../-shared/constants';
import ServerChapterSelect from '../-shared/ServerChapterSelect';
import UpdatedAtCaption from '../-shared/UpdatedAtCaption';
import ProjectApplicantsModal from './ProjectApplicantsModal';
import { useApplicantStatusControl } from './useApplicantStatusControl';
import { useCurrentMatchingRound } from './useCurrentMatchingRound';

const SEARCH_DEBOUNCE = { delay: 300, maxWait: 1000 };

// 어드민 뷰: 지부별 지원 통계 + 전체 프로젝트 지원 목록
const AdminApplications = () => {
  const { role, gisuId, serverChapterId: ownChapterId } = useSessionStore((state) => state.session);
  const ownChapterOnly = getChapterScope(role) === 'OWN';
  // 권한표: 학교회장단 · 학교운영진은 지원 통계만, 중앙운영진은 지원서 열람 불가
  const { canReadApplicants, canReadApplication } = getApplicationsAccess(role);
  const {
    data: allChapters = [],
    isError: chaptersError,
    isSuccess: chaptersLoaded,
  } = useChapters(gisuId);
  // 지부 탭에는 전 지부를 보여 주고, 지부장 · 학교 운영진은 소속 지부만 고를 수 있음
  const chapters = allChapters;
  const toast = useAppToast();
  // 고르기 전에는 소속 지부, 없으면 첫 지부
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const chapterId =
    selectedChapterId ??
    (ownChapterOnly
      ? ownChapterId
      : (chapters.find(({ id }) => id === ownChapterId)?.id ?? chapters[0]?.id ?? null));
  const selectedChapter = chapters.find(({ id }) => id === chapterId);
  const chapterName = selectedChapter?.name ?? '';

  const [keyword, setKeyword] = useState('');
  // 글자마다 요청하지 않도록 입력이 멈추면(300ms) 검색, 계속 입력해도 1초마다는 중간 결과를 보여 줌
  const searchKeyword = useDebouncedValue(keyword, SEARCH_DEBOUNCE);
  const [filters, setFilters] = useState(INITIAL_APPLICATION_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  // 학교 필터는 고른 지부 소속 학교 (값은 학교 ID)
  const filterDropdowns = APPLICATION_FILTERS.map((filter) =>
    filter.key === 'school'
      ? {
          ...filter,
          options: (selectedChapter?.schools ?? []).map(({ id, name }) => ({
            value: String(id),
            label: name,
          })),
        }
      : filter,
  );

  const projects = useApplicationProjects(
    // 지원자 목록을 볼 수 없으면 표 데이터를 부르지 않음 (지원자 · 보조 PM · 권한도 프로젝트가 없어 부르지 않음)
    !canReadApplicants || gisuId === null || chapterId === null
      ? null
      : toProjectsQuery({ gisuId, chapterId, keyword: searchKeyword, filters, page }),
  );
  const rows = projects.data?.rows ?? [];
  const rowProjectIds = rows.map(({ projectId }) => projectId);
  const applicants = useProjectsApplicants(rowProjectIds);
  const coPms = useProjectsCoPms(rowProjectIds);
  // 배정 상태 변경 (서버 권한 기준: 지부장 · 학교 운영진은 조회만)
  const statusControl = useApplicantStatusControl(chapterId, rowProjectIds);

  // 프로젝트 줄 + 지원자. 차수 필터는 지원자만 거름 (고른 차수가 없으면 전체)
  // 보조 PM은 목록 API에 없어서 팀원 구성 일괄 조회로 붙임
  const groups: ProjectApplicationGroup[] = rows.map((project) => ({
    project,
    coPms: coPms.data?.get(project.projectId) ?? [],
    applicants: (applicants.data?.get(project.projectId) ?? []).filter(
      ({ round }) => filters.round.length === 0 || filters.round.includes(String(round)),
    ),
  }));
  const selectedGroup = groups.find(({ project }) => project.projectId === selectedProjectId);

  // 01 지원 통계: 지부 통계에서 지금 매칭 종류(Plan-Design · Plan-PE)와 차수만 골라 보여 줌
  // 프로젝트 · 학교 이름은 통계 응답에 같이 옴
  const statistics = useApplicationStatistics(chapterId === null ? null : { chapterId });
  // 지금 매칭 종류 · 차수는 서버가 알려 준 값을 쓰고, 진행 중인 차수가 없으면 지부 일정으로 정함
  const scheduleRound = useCurrentMatchingRound(chapterId);
  const current = (statistics.data && getCurrentRound(statistics.data)) ?? scheduleRound;

  // 지부 · 검색어 · 필터를 바꾸면 첫 페이지부터
  const handleChapterChange = (nextChapterId: number) => {
    setSelectedChapterId(nextChapterId);
    // 다른 지부 학교는 고를 수 없으니 학교 선택은 해제
    setFilters((prev) => ({ ...prev, school: [] }));
    setPage(1);
  };
  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setPage(1);
  };
  const handleFilterChange = (key: ApplicationFilterKey, value: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <main className="flex flex-col items-start gap-8 px-8 pt-12 pb-20">
      <PageHeader
        className="w-full max-w-[1152px]"
        breadcrumbs={getBreadcrumbs('지원 현황')}
        title="지원 현황"
        description="프로젝트별 지원 내역과 지원 현황을 확인하고 관리할 수 있어요."
      />
      <div className="flex w-full max-w-[1060px] flex-col gap-8">
        {/* 기수 · 지부를 모르면 아무 요청도 하지 않아 화면이 비므로 이유를 보여 줌 */}
        {/* TODO: 안내 화면이 피그마에 나오면 교체 */}
        {gisuId === null && (
          <p role="alert" className="text-body-3-medium text-red-500">
            내 정보에 현재 기수가 없어서 지원 현황을 불러올 수 없어요. 이번 기수 챌린저 · 운영진
            계정인지 확인해 주세요.
          </p>
        )}
        {chaptersLoaded && chapterId === null && (
          <p role="alert" className="text-body-3-medium text-red-500">
            {ownChapterOnly
              ? '내 정보에 소속 지부가 없어서 지원 현황을 불러올 수 없어요.'
              : '이번 기수에 등록된 지부가 없어요.'}
          </p>
        )}
        <ServerChapterSelect
          chapters={chapters}
          value={chapterId}
          onValueChange={handleChapterChange}
          selectableChapterId={ownChapterOnly ? ownChapterId : undefined}
          onBlockedSelect={() =>
            toast.show('소속 지부의 지원 현황만 볼 수 있어요', { color: 'error' })
          }
        />

        <div className="flex w-full flex-col gap-16">
          <section className="flex w-full flex-col gap-4">
            <SectionHeader
              number="01"
              title="지원 통계"
              // 마지막으로 불러온 시각. 불러오지 못했을 때도 마지막 요청 시각을 보여 줌
              slot={
                <UpdatedAtCaption
                  updatedAt={Math.max(statistics.dataUpdatedAt, statistics.errorUpdatedAt)}
                />
              }
            />
            {/* TODO: 불러오기 실패 화면이 피그마에 나오면 교체 */}
            {statistics.isError && (
              <p role="alert" className="text-body-3-medium text-red-500">
                지원 통계를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
              </p>
            )}
            {/* 처음 불러오는 동안은 0명 · 빈 차트가 잠깐 보이지 않도록 그리지 않음 */}
            {statistics.data && (
              <div className="flex w-full flex-col gap-4">
                {/* 피그마: N차 매칭 지원 현황 572px + 총원 474px, 사이 16px */}
                <div className="flex w-full items-stretch gap-4">
                  <div className="w-[572px] shrink-0">
                    <RoundProgressCard
                      {...toRoundProgress(statistics.data, current.type, current.round)}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <TotalApplicantsCard {...toTotalApplicants(statistics.data, current.round)} />
                  </div>
                </div>
                <ProjectApplicationsChart projects={toProjectApplications(statistics.data)} />
              </div>
            )}
          </section>

          {/* 권한표: 학교회장단 · 학교운영진은 지원자 목록을 볼 수 없음 */}
          {canReadApplicants && (
            <section className="flex w-full flex-col gap-4">
              <SectionHeader
                number="02"
                title="지원자 목록"
                // 프로젝트 줄 · 지원자 중 더 늦게 불러온 시각 (불러오지 못했으면 마지막 요청 시각)
                slot={
                  <UpdatedAtCaption
                    updatedAt={Math.max(
                      projects.dataUpdatedAt,
                      projects.errorUpdatedAt,
                      applicants.dataUpdatedAt,
                      applicants.errorUpdatedAt,
                    )}
                  />
                }
              />
              <div className="flex w-full flex-col gap-5">
                <div className="flex w-full items-start justify-between gap-4">
                  <SearchBar
                    value={keyword}
                    onValueChange={handleKeywordChange}
                    placeholder="{프로젝트 명}으로 검색하세요"
                    className="w-[456px]"
                  />
                  <FilterDropdownGroup
                    filters={filterDropdowns}
                    keys={['school', 'part', 'round', 'recruitStatus']}
                    values={filters}
                    onValueChange={handleFilterChange}
                  />
                </div>
                {/* TODO: 불러오기 실패 화면이 피그마에 나오면 교체 */}
                {(chaptersError || projects.isError || applicants.isError) && (
                  <p role="alert" className="text-body-3-medium text-red-500">
                    지원자 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
                  </p>
                )}
                {/* 처음 불러오는 동안은 빈 목록 문구가 잠깐 보이지 않도록 그리지 않음 */}
                {projects.data && (
                  <ApplicationTable
                    view="ADMIN"
                    // 반응형 없음: 표는 피그마 폭(1060) 그대로 두고, 화면에 보이는 폭(좌우 여백 32씩 제외)보다 넓으면 가로 스크롤
                    className="max-w-[calc(100cqw-64px)]"
                    contentClassName="min-w-[1060px]"
                    groups={groups}
                    onProjectClick={({ project }) => setSelectedProjectId(project.projectId)}
                  />
                )}
              </div>
              <Pagination
                page={page}
                totalPages={projects.data?.totalPages ?? 1}
                onPageChange={setPage}
                className="mt-6 self-center"
              />
            </section>
          )}
        </div>
      </div>
      <ProjectApplicantsModal
        group={selectedGroup ?? null}
        chapterName={chapterName}
        onClose={() => setSelectedProjectId(null)}
        onStatusChange={
          selectedGroup && statusControl.changeStatus(selectedGroup.project.projectId)
        }
        canChangeStatus={
          selectedGroup && statusControl.canChangeStatus(selectedGroup.project.projectId)
        }
        isUpdatingStatus={statusControl.isUpdating}
        canReadApplication={canReadApplication}
      />
    </main>
  );
};

export default AdminApplications;
