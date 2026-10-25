import { PageHeader, SectionHeader } from '@umc-product/react';
import { useState } from 'react';

import { useCanManageMatching, useSessionStore } from '@/entities/session';
import { ChapterSelectHeader, useVisibleChapters } from '@/features/chapter-select';
import {
  ChapterMatchingRateCard,
  type MatchedMember,
  MatchingResultSheet,
  MOCK_CHAPTER_MATCHING_RATE,
  MOCK_MATCHING_PERIOD_OPEN,
  MOCK_MATCHING_RESULTS,
  MOCK_PROJECT_MATCHINGS,
  MOCK_ROUND_MATCHINGS,
  MOCK_SCHOOL_MATCHINGS,
  MOCK_UNASSIGNED_CHALLENGERS,
  type PartMatching,
  ProjectMatchingChart,
  type ProjectMatchingResult,
  RoundMatchingCard,
  SchoolMatchingCard,
  type UnassignedChallenger,
} from '@/features/matching-status';
import { useAppToast } from '@/widgets/toast';

import { getBreadcrumbs } from '../-shared/constants';
import UpdatedAtCaption from '../-shared/UpdatedAtCaption';
import ManualAssignModal from './ManualAssignModal';
import MatchedApplicationModal, { type MatchedApplicationTarget } from './MatchedApplicationModal';

// 피그마 전체 매칭 현황: 지부 선택 + 01 매칭 통계 + 02 매칭 결과 시트
const MatchingStatusPage = () => {
  const ownChapterId = useSessionStore((state) => state.session.chapterId);
  const chapters = useVisibleChapters();
  // 기본 선택: 소속 지부, 없으면 첫 번째 지부
  const [chapterId, setChapterId] = useState(
    () => chapters.find((chapter) => chapter.id === ownChapterId)?.id ?? chapters[0]?.id ?? '',
  );
  // 마스터 · 지부장(소속 지부)만, 매칭 기간 동안만 지원서 열람 · 매칭 해제 · 수동 배정
  const canManage = useCanManageMatching(chapterId) && MOCK_MATCHING_PERIOD_OPEN;

  // TODO: 매칭 결과 · 미배정 챌린저 API 연동 후 서버 데이터로 교체
  const [results, setResults] = useState(MOCK_MATCHING_RESULTS);
  const [unassigned, setUnassigned] = useState(MOCK_UNASSIGNED_CHALLENGERS);
  const [assignTarget, setAssignTarget] = useState<{
    project: ProjectMatchingResult;
    part: PartMatching;
  } | null>(null);
  const [applicationTarget, setApplicationTarget] = useState<MatchedApplicationTarget | null>(null);
  const toast = useAppToast();
  const chapterName = chapters.find((chapter) => chapter.id === chapterId)?.name ?? '';

  // 프로젝트 한 곳의 파트 칸(매칭된 챌린저 목록)만 바꿈
  const updatePartMembers = (
    projectId: string,
    part: PartMatching['part'],
    update: (members: MatchedMember[]) => MatchedMember[],
  ) =>
    setResults((prev) =>
      prev.map((platform) => ({
        ...platform,
        projects: platform.projects.map((project) =>
          project.projectId !== projectId
            ? project
            : {
                ...project,
                parts: project.parts.map((current) =>
                  current.part === part
                    ? { ...current, members: update(current.members) }
                    : current,
                ),
              },
        ),
      })),
    );

  // TODO: 수동 배정 API 연동. 지금은 화면에서만 빈 칸을 채우고 미배정 목록에서 뺌
  // 수동 배정은 랜덤 배정과 같은 경로라 결과표에 R(랜덤 매칭)로 표시
  const handleAssign = ({ challengerId, challengerName, schoolName }: UnassignedChallenger) => {
    if (!assignTarget) return;
    updatePartMembers(assignTarget.project.projectId, assignTarget.part.part, (members) => [
      ...members,
      {
        memberId: challengerId,
        challengerName,
        schoolName,
        round: 'RANDOM',
        matchedAt: new Date().toISOString(),
        submittedAt: null,
      },
    ]);
    setUnassigned((prev) => prev.filter((challenger) => challenger.challengerId !== challengerId));
  };

  // TODO: 매칭 해제 API 연동. 지금은 화면에서만 칸을 비우고 미배정 목록으로 되돌림
  const handleRelease = ({ project, part, member }: MatchedApplicationTarget) => {
    updatePartMembers(project.projectId, part.part, (members) =>
      members.filter(({ memberId }) => memberId !== member.memberId),
    );
    setUnassigned((prev) => [
      ...prev,
      {
        challengerId: member.memberId,
        challengerName: member.challengerName,
        schoolName: member.schoolName,
        part: part.part,
      },
    ]);
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
        <ChapterSelectHeader value={chapterId} onValueChange={setChapterId} />

        <div className="flex w-full flex-col gap-16">
          <section className="flex w-full flex-col gap-4">
            <SectionHeader number="01" title="매칭 통계" slot={<UpdatedAtCaption />} />
            {/* TODO: 매칭 통계 API 연동 */}
            <div className="flex w-full flex-col gap-4">
              {/* 피그마 카드 폭 473 : 375 : 277.5 */}
              <div className="grid w-full grid-cols-[473fr_375fr_277.5fr] gap-4">
                <ChapterMatchingRateCard {...MOCK_CHAPTER_MATCHING_RATE} />
                <RoundMatchingCard rounds={MOCK_ROUND_MATCHINGS} />
                <SchoolMatchingCard schools={MOCK_SCHOOL_MATCHINGS} />
              </div>
              <ProjectMatchingChart projects={MOCK_PROJECT_MATCHINGS} />
            </div>
          </section>

          <section className="flex w-full flex-col gap-4">
            <SectionHeader number="02" title="매칭 결과 시트" slot={<UpdatedAtCaption />} />
            {/* TODO: 매칭 결과 API 연동 */}
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
                  onEmptySlotClick={
                    canManage ? (project, part) => setAssignTarget({ project, part }) : undefined
                  }
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
        onRelease={canManage ? handleRelease : undefined}
      />
      {/* 결과 시트 빈 칸 → 팀원 수동 배정 */}
      <ManualAssignModal
        target={assignTarget}
        challengers={unassigned}
        onClose={() => setAssignTarget(null)}
        onAssign={handleAssign}
      />
    </main>
  );
};

export default MatchingStatusPage;
