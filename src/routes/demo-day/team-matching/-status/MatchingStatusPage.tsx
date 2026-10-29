import { PageHeader, SectionHeader } from '@umc-product/react';
import { useState } from 'react';

import { useChapters } from '@/entities/chapter';
import { useSessionStore } from '@/entities/session';
import {
  ChapterMatchingRateCard,
  getTotalCapacity,
  MatchingResultSheet,
  type PartMatching,
  ProjectMatchingChart,
  type ProjectMatchingResult,
  RoundMatchingCard,
  SchoolMatchingCard,
  toChapterMatchingRate,
  toMatchingResults,
  toProjectMatchings,
  toRoundMatchings,
  toSchoolMatchings,
  useChapterMatchingStatistics,
  useChapterProjects,
  useMatchingPermissions,
  useProjectsMembers,
} from '@/features/matching-status';
import { toId } from '@/shared/api/toId';
import { useAppToast } from '@/widgets/toast';

import { getBreadcrumbs } from '../-shared/constants';
import ServerChapterSelect from '../-shared/ServerChapterSelect';
import UpdatedAtCaption from '../-shared/UpdatedAtCaption';
import ManualAssignModal from './ManualAssignModal';
import MatchedApplicationModal, { type MatchedApplicationTarget } from './MatchedApplicationModal';

// 피그마 전체 매칭 현황: 지부 선택 + 01 매칭 통계 + 02 매칭 결과 시트
const MatchingStatusPage = () => {
  const { role, gisuId, serverChapterId: ownChapterId } = useSessionStore((state) => state.session);
  const view = useSessionStore((state) => state.view);
  // 권한표: 전체 매칭 현황은 모든 역할이 전 지부를 조회할 수 있음
  const { data: chapters = [] } = useChapters(gisuId);
  // 기본 선택: 소속 지부, 없으면 첫 번째 지부
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const chapterId =
    selectedChapterId ??
    chapters.find(({ id }) => id === ownChapterId)?.id ??
    chapters[0]?.id ??
    null;
  // 권한표: 지원서 열람 · 매칭 해제 · 수동 배정은 마스터(전 지부) · 지부장(소속 지부 프로젝트)만
  // 칸을 누를 수 있는지는 역할로, 실제 해제 · 배정은 서버 권한(canUnassign · canAssign)으로 한 번 더 확인
  // 서버는 기간 제한이 없어서 매칭 기간 확인은 하지 않음
  const canManage =
    view === 'ADMIN' &&
    (role === 'SUPER_ADMIN' ||
      role === 'HQ_LEAD' ||
      (role === 'CHAPTER_ADMIN' && chapterId !== null && chapterId === ownChapterId));

  // 01 매칭 통계: 통계에 없는 프로젝트 이름 · 정원은 지부 프로젝트 목록, 파트별 매칭 인원은 팀원 구성에서
  const statistics = useChapterMatchingStatistics(chapterId);
  const chapterProjects = useChapterProjects(gisuId, chapterId);
  const projects = chapterProjects.data ?? [];
  const projectIds = projects.flatMap(({ id }) => {
    const projectId = toId(id);
    return projectId === null ? [] : [projectId];
  });
  const members = useProjectsMembers(projectIds);
  const schools = chapters.find(({ id }) => id === chapterId)?.schools ?? [];

  // 02 매칭 결과 시트: 통계와 같은 지부 프로젝트 + 팀원 구성
  const results = chapterProjects.data
    ? toMatchingResults(chapterProjects.data, members.data ?? new Map())
    : [];

  // 수동 배정 · 매칭 해제 서버 권한 (관리할 수 있는 역할일 때만 확인)
  const permissions = useMatchingPermissions(canManage ? projectIds : []);
  const [assignTarget, setAssignTarget] = useState<{
    project: ProjectMatchingResult;
    part: PartMatching;
  } | null>(null);
  const [applicationTarget, setApplicationTarget] = useState<MatchedApplicationTarget | null>(null);
  const toast = useAppToast();
  const chapterName = chapters.find(({ id }) => id === chapterId)?.name ?? '';

  const handleEmptySlotClick = (project: ProjectMatchingResult, part: PartMatching) => {
    if (permissions.data?.get(project.projectId)?.canAssign) setAssignTarget({ project, part });
    else toast.show('이 프로젝트에는 팀원을 배정할 수 없어요.', { color: 'error' });
  };

  const handleReleased = () => {
    setApplicationTarget(null);
    toast.show('매칭이 해제됐어요.', { color: 'error' });
  };

  return (
    <main className="flex flex-col items-start gap-8 px-8 pt-12 pb-20">
      <PageHeader
        className="w-full max-w-[1152px]"
        breadcrumbs={getBreadcrumbs('전체 매칭 현황')}
        title="전체 매칭 현황"
        description="프로젝트 매칭 현황을 확인할 수 있어요."
      />
      <div className="flex w-full max-w-[1158px] flex-col gap-8">
        <ServerChapterSelect
          chapters={chapters}
          value={chapterId}
          onValueChange={setSelectedChapterId}
        />

        <div className="flex w-full flex-col gap-16">
          <section className="flex w-full flex-col gap-4">
            <SectionHeader
              number="01"
              title="매칭 통계"
              // 마지막으로 불러온 시각. 불러오지 못했을 때도 마지막 요청 시각을 보여 줌
              slot={
                <UpdatedAtCaption
                  updatedAt={Math.max(statistics.dataUpdatedAt, statistics.errorUpdatedAt)}
                />
              }
            />
            {/* TODO: 불러오기 실패 화면이 피그마에 나오면 교체 */}
            {(statistics.isError || chapterProjects.isError) && (
              <p role="alert" className="text-body-3-medium text-red-500">
                매칭 통계를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
              </p>
            )}
            {/* 처음 불러오는 동안은 0명 · 빈 차트가 잠깐 보이지 않도록 그리지 않음 */}
            {statistics.data && chapterProjects.data && (
              <div className="flex w-full flex-col gap-4">
                {/* 피그마 카드 폭 473 : 375 : 277.5 */}
                <div className="grid w-full grid-cols-[473fr_375fr_277.5fr] gap-4">
                  <ChapterMatchingRateCard
                    {...toChapterMatchingRate(statistics.data, getTotalCapacity(projects))}
                  />
                  <RoundMatchingCard rounds={toRoundMatchings(statistics.data)} />
                  <SchoolMatchingCard schools={toSchoolMatchings(statistics.data, schools)} />
                </div>
                <ProjectMatchingChart
                  projects={toProjectMatchings(
                    statistics.data,
                    projects,
                    members.data ?? new Map(),
                  )}
                />
              </div>
            )}
          </section>

          <section className="flex w-full flex-col gap-4">
            <SectionHeader
              number="02"
              title="매칭 결과 시트"
              // 프로젝트 · 팀원 구성 중 더 늦게 불러온 시각 (불러오지 못했으면 마지막 요청 시각)
              slot={
                <UpdatedAtCaption
                  updatedAt={Math.max(
                    chapterProjects.dataUpdatedAt,
                    chapterProjects.errorUpdatedAt,
                    members.dataUpdatedAt,
                    members.errorUpdatedAt,
                  )}
                />
              }
            />
            {/* TODO: 불러오기 실패 화면이 피그마에 나오면 교체 */}
            {(chapterProjects.isError || members.isError) && (
              <p role="alert" className="text-body-3-medium text-red-500">
                매칭 결과를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
              </p>
            )}
            <div className="flex w-full flex-col gap-4">
              {results.map((platformResults) => (
                <MatchingResultSheet
                  key={platformResults.platform}
                  {...platformResults}
                  onMemberClick={
                    canManage
                      ? (project, part, member) => setApplicationTarget({ project, part, member })
                      : undefined
                  }
                  onEmptySlotClick={canManage ? handleEmptySlotClick : undefined}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
      {/* 결과 시트 매칭된 칸 → 파트 지원서 (어드민은 매칭 해제) */}
      <MatchedApplicationModal
        target={applicationTarget}
        chapterName={chapterName}
        onClose={() => setApplicationTarget(null)}
        canRelease={
          applicationTarget !== null &&
          permissions.data?.get(applicationTarget.project.projectId)?.canUnassign === true
        }
        onReleased={handleReleased}
      />
      {/* 결과 시트 빈 칸 → 팀원 수동 배정 */}
      <ManualAssignModal target={assignTarget} onClose={() => setAssignTarget(null)} />
    </main>
  );
};

export default MatchingStatusPage;
