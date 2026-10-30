import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { AddIcon, UsersPictogram, WarningTriangleIcon } from '@umc-product/icons';
import { Button, Dialog, Dimmed, PageHeader, SegmentedControl } from '@umc-product/react';
import { Dialog as RadixDialog } from 'radix-ui';
import { type ReactNode, useEffect, useRef, useState } from 'react';

import { useChapters } from '@/entities/chapter';
import { getApplicationsView, type Role, useSessionStore, type View } from '@/entities/session';
import { useProjectDetail } from '@/features/applications';
import {
  getCurrentMatchingStep,
  toScheduleByTrack,
  useMatchingRounds,
} from '@/features/matching-schedule';
import {
  getProjectMembers,
  TeamCompositionPanel,
  toTeamRecruitments,
} from '@/features/project-list';
import {
  type ManagedProject,
  ProjectManagementCard,
  type RecruitPart,
} from '@/features/project-management';
import { deleteProject } from '@/features/project-management/api/deleteProject';
import { managedProjectsInfiniteQueryOptions } from '@/features/project-management/api/managedProjectsQuery';
import { cn } from '@/shared/lib/cn';
import ProjectCard from '@/widgets/card/projectCard';
import { useAppToast } from '@/widgets/toast';

import EmptyDocumentIcon from './assets/empty-document.svg?react';

const BREADCRUMBS = [
  { label: '데모데이 매칭', href: '/demo-day' },
  { label: '프로젝트 설정', href: '/demo-day/project-settings/notice' },
  { label: '프로젝트 관리' },
];

const PART_LABEL: Record<RecruitPart, string> = {
  DESIGN: 'Design',
  WEB_PE: 'Web PE',
  MOBILE_PE: 'Mobile PE',
};

// 프로젝트 카드 팝업 하단 버튼 반환 함수
const getProjectDetailActions = (
  role: Role,
  view: View,
  isApplicationPeriod: boolean,
  isMatchingPeriod: boolean,
  planUrl: string | null,
  onEditProject: () => void,
  onTeamClick: () => void,
): ReactNode => {
  const usersButton = (
    <Button
      variant="weak"
      color="neutral"
      size="md"
      icon={<UsersPictogram size={30} color="var(--color-icon-subtle)" />}
      aria-label="팀원 현황"
      onClick={onTeamClick}
    />
  );

  const planButton = (
    <Button
      variant="weak"
      size="md"
      className="flex-1"
      disabled={!planUrl}
      onClick={() => planUrl && window.open(planUrl, '_blank')}
    >
      기획 보기
    </Button>
  );

  const recruitButton = (
    <Button size="md" className="flex-1">
      모집 문항 보기
    </Button>
  );

  const recruitButtonDisabled = (
    <Button size="md" className="flex-1" disabled>
      모집 문항 보기
    </Button>
  );

  const editButton = (
    <Button size="md" className="flex-1" onClick={onEditProject}>
      프로젝트 수정하기
    </Button>
  );

  // 지원기간: PM 챌린저 + 어드민 모두 모집 문항 보기
  if (isApplicationPeriod) {
    return (
      <>
        {usersButton}
        {planButton}
        {recruitButton}
      </>
    );
  }

  // PM 챌린저: 지원기간 전 / 매칭기간 모두 프로젝트 수정하기
  if (view === 'PM_CHALLENGER') {
    return (
      <>
        {usersButton}
        {planButton}
        {editButton}
      </>
    );
  }

  // 매칭기간 (어드민): 모집 문항 보기 비활성화
  if (isMatchingPeriod) {
    return (
      <>
        {usersButton}
        {planButton}
        {recruitButtonDisabled}
      </>
    );
  }

  // 지원기간 전 - 타 지부장(CHAPTER_ADMIN): 모집 문항 보기
  if (role === 'CHAPTER_ADMIN') {
    return (
      <>
        {usersButton}
        {planButton}
        {recruitButton}
      </>
    );
  }

  // 지원기간 전 - SUPER_ADMIN, HQ_LEAD, HQ_ADMIN: 프로젝트 수정하기
  return (
    <>
      {usersButton}
      {planButton}
      {editButton}
    </>
  );
};

// 프로젝트 관리 워딩 반환 함수
const getDescription = (role: Role, view: View): string => {
  if (view === 'PM_CHALLENGER') {
    return '내 프로젝트를 등록하고 수정하거나, 매칭 현황을 확인할 수 있어요. 팀 매칭 진행 중에는 프로젝트를 수정할 수 없어요.';
  }
  if (role === 'HQ_ADMIN') {
    return '전체 지부의 프로젝트의 진행 상태(승인대기, 승인완료 등)를 조회할 수 있어요.';
  }
  if (role === 'CHAPTER_ADMIN') {
    return '내 지부의 프로젝트 정보를 확인하고 수정할 수 있어요. 팀 매칭 진행 중에는 프로젝트를 수정할 수 없어요.';
  }
  // SUPER_ADMIN, HQ_LEAD
  return '전체 지부의 프로젝트 정보를 확인하고 수정할 수 있어요. 팀 매칭 진행 중에는 프로젝트를 수정할 수 없어요.';
};

// 프로젝트 없을 시
const EmptyState = ({
  showRegisterButton,
  onRegister,
}: {
  showRegisterButton: boolean;
  onRegister?: () => void;
}) => (
  <div className="flex flex-col items-center gap-6 py-20">
    <EmptyDocumentIcon width={56} height={56} className="text-teal-grey-200" />
    <div className="flex flex-col items-center gap-2">
      <p className="text-title-3-medium text-placeholder">등록된 프로젝트가 없어요</p>
      <p className="text-heading-5-medium text-placeholder">
        챌린저들이 프로젝트를 등록한 후 확인할 수 있어요.
      </p>
    </div>
    {showRegisterButton && (
      <Button size="sm" onClick={onRegister}>
        <div className="flex items-center gap-2">
          <AddIcon size={16} />
          프로젝트 등록
        </div>
      </Button>
    )}
  </div>
);

const ProjectsPage = () => {
  const role = useSessionStore((state) => state.session.role);
  const view = useSessionStore((state) => state.view);
  const ownChapterId = useSessionStore((state) => state.session.serverChapterId);
  const gisuId = useSessionStore((state) => state.session.gisuId);
  const { data: allChapters = [] } = useChapters(gisuId);
  const isChapterLeader = role === 'CHAPTER_ADMIN';
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
    isChapterLeader ? ownChapterId : null,
  );
  const chapterId = selectedChapterId ?? allChapters[0]?.id ?? null;
  const [selectedProject, setSelectedProject] = useState<ManagedProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ManagedProject | null>(null);
  const [deletedProjectIds, setDeletedProjectIds] = useState<string[]>([]);
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const { data: rounds } = useMatchingRounds(chapterId ?? undefined);
  const schedules = rounds ? toScheduleByTrack(rounds) : null;
  const designStep = schedules
    ? getCurrentMatchingStep(schedules.PLAN_DESIGN.setting, new Date())
    : null;
  const peStep = schedules ? getCurrentMatchingStep(schedules.PLAN_PE.setting, new Date()) : null;
  const isApplicationPeriod =
    (designStep?.status === 'ONGOING' && designStep.phase === 'APPLY') ||
    (peStep?.status === 'ONGOING' && peStep.phase === 'APPLY');
  const isMatchingPeriod =
    (designStep?.status === 'ONGOING' && designStep.phase === 'MATCHING') ||
    (peStep?.status === 'ONGOING' && peStep.phase === 'MATCHING');

  const resolvedView = getApplicationsView(role, view);
  const isPmChallenger = resolvedView === 'PM_CHALLENGER';
  const navigate = useNavigate();

  const [teamPanelOpen, setTeamPanelOpen] = useState(false);

  const { data: selectedProjectDetail } = useProjectDetail(
    selectedProject ? Number(selectedProject.projectId) : null,
  );
  const planUrl = selectedProjectDetail?.planUrl ?? null;

  const { data: teamMembersData } = useQuery({
    queryKey: ['project-members', selectedProject?.projectId],
    queryFn: () => getProjectMembers(Number(selectedProject!.projectId)),
    enabled: selectedProject !== null,
  });

  const teamRecruitments = toTeamRecruitments(selectedProject?.recruitments ?? [], teamMembersData);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    ...managedProjectsInfiniteQueryOptions({
      gisuId: gisuId ?? 0,
      chapterId: isPmChallenger ? (ownChapterId ?? undefined) : (chapterId ?? undefined),
    }),
    enabled: !!gisuId && (isPmChallenger || chapterId !== null),
  });
  const allProjects = data?.pages.flatMap((p) => p.projects) ?? [];
  const projects = allProjects.filter((p) => !deletedProjectIds.includes(p.projectId));

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: (_data, projectId) => {
      setDeletedProjectIds((prev) => [...prev, projectId]);
      setDeleteTarget(null);
      toast.show('프로젝트가 삭제됐어요.', { color: 'error' });
      queryClient.invalidateQueries({ queryKey: ['managed-projects'] });
    },
    onError: () => {
      toast.show('프로젝트 삭제에 실패했어요. 다시 시도해 주세요.', { color: 'error' });
    },
  });

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteMutate(deleteTarget.projectId);
  };

  return (
    <main className="flex flex-col items-start gap-8 px-8 pt-12 pb-20">
      <PageHeader
        className="w-full max-w-[1082px]"
        breadcrumbs={BREADCRUMBS}
        title="프로젝트 관리"
        description={getDescription(role, resolvedView)}
      />

      <div className="flex w-full max-w-[1082px] flex-col">
        <div
          className={cn(
            'flex items-center justify-between gap-4',
            isPmChallenger ? 'pb-0' : 'pb-8',
          )}
        >
          {!isPmChallenger && allChapters.length > 0 && (
            <SegmentedControl
              aria-label="지부 선택"
              items={allChapters.map((c) => ({ value: String(c.id), label: c.name }))}
              value={String(selectedChapterId ?? allChapters[0]?.id ?? '')}
              onValueChange={(v) => !isChapterLeader && setSelectedChapterId(Number(v))}
              className={cn(
                '[&_[role=radio]:not([data-checked])]:text-teal-600',
                isChapterLeader && '[&_[role=radio]:not([data-checked])]:cursor-not-allowed',
              )}
            />
          )}
          {role !== 'HQ_ADMIN' && (!isPmChallenger || projects.length > 0) && (
            <Button
              size="sm"
              className="ml-auto h-11 shrink-0"
              onClick={() => navigate({ to: '/demo-day/project-settings/projects/new' })}
            >
              <div className="flex items-center gap-2">
                <AddIcon size={16} />
                프로젝트 등록
              </div>
            </Button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="flex min-h-[400px] w-full items-center justify-center rounded-xl border border-teal-grey-100 bg-white shadow-drop-neutral-3">
            <EmptyState
              showRegisterButton={isPmChallenger}
              onRegister={() => navigate({ to: '/demo-day/project-settings/projects/new' })}
            />
          </div>
        ) : isPmChallenger ? (
          <ul className="mt-2 flex flex-col gap-[10px]">
            {projects.map((project) => (
              <li key={project.projectId}>
                <ProjectManagementCard
                  project={project}
                  role={role}
                  isPmChallenger
                  isMatchingPeriod={isMatchingPeriod}
                  onCardClick={() => setSelectedProject(project)}
                  onViewApplications={() =>
                    navigate({ to: '/demo-day/team-matching/applications' })
                  }
                  onDelete={() => setDeleteTarget(project)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col">
            {(() => {
              const webProjects = projects.filter((p) => p.platform === 'WEB');
              const mobileProjects = projects.filter((p) => p.platform === 'MOBILE');
              return (
                <>
                  {webProjects.length > 0 && (
                    <section className="flex flex-col">
                      <h2 className="mb-[10px] text-title-2-semibold">Web</h2>
                      <ul className="flex flex-col gap-[10px]">
                        {webProjects.map((project) => (
                          <li key={project.projectId}>
                            <ProjectManagementCard
                              project={project}
                              role={role}
                              isApplicationPeriod={isApplicationPeriod}
                              isMatchingPeriod={isMatchingPeriod}
                              onCardClick={() => setSelectedProject(project)}
                              onViewApplications={() =>
                                navigate({ to: '/demo-day/team-matching/applications' })
                              }
                              onManageApproval={() =>
                                navigate({
                                  to: '/demo-day/project-settings/projects/$projectId',
                                  params: { projectId: project.projectId },
                                })
                              }
                              onDelete={() => setDeleteTarget(project)}
                            />
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {mobileProjects.length > 0 && (
                    <section className="mt-10 flex flex-col">
                      <h2 className="mb-[10px] text-title-2-semibold">Mobile</h2>
                      <ul className="flex flex-col gap-[10px]">
                        {mobileProjects.map((project) => (
                          <li key={project.projectId}>
                            <ProjectManagementCard
                              project={project}
                              role={role}
                              isApplicationPeriod={isApplicationPeriod}
                              isMatchingPeriod={isMatchingPeriod}
                              onCardClick={() => setSelectedProject(project)}
                              onViewApplications={() =>
                                navigate({ to: '/demo-day/team-matching/applications' })
                              }
                              onManageApproval={() =>
                                navigate({
                                  to: '/demo-day/project-settings/projects/$projectId',
                                  params: { projectId: project.projectId },
                                })
                              }
                              onDelete={() => setDeleteTarget(project)}
                            />
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </>
              );
            })()}
          </div>
        )}
        <div ref={sentinelRef} className="h-1" />
      </div>

      <RadixDialog.Root
        open={selectedProject !== null}
        onOpenChange={(open) => {
          if (!open) {
            setTeamPanelOpen(false);
            setSelectedProject(null);
          }
        }}
      >
        <RadixDialog.Portal>
          <RadixDialog.Overlay asChild>
            <Dimmed />
          </RadixDialog.Overlay>
          {selectedProject && (
            <RadixDialog.Content
              aria-describedby={undefined}
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                (event.currentTarget as HTMLElement).focus();
              }}
              className="fixed top-1/2 left-1/2 z-(--umc-z-dimmed) -translate-x-1/2 -translate-y-1/2 outline-none"
            >
              <div className="relative">
                <RadixDialog.Title className="sr-only">
                  {selectedProject.projectName}
                </RadixDialog.Title>
                <ProjectCard
                  projectName={selectedProject.projectName}
                  logoUrl={selectedProject.logoUrl}
                  thumbnailUrl={selectedProject.thumbnailUrl}
                  pmName={selectedProject.pmName}
                  schoolName={selectedProject.schoolName}
                  description={selectedProject.description}
                  recruitments={selectedProject.recruitments.map((r) => ({
                    label: PART_LABEL[r.part],
                    applied: r.applied,
                    capacity: r.capacity,
                    status: r.status,
                  }))}
                  actions={getProjectDetailActions(
                    role,
                    resolvedView,
                    isApplicationPeriod,
                    isMatchingPeriod,
                    planUrl,
                    () =>
                      navigate({
                        to: '/demo-day/project-settings/projects/$projectId',
                        params: { projectId: selectedProject.projectId },
                      }),
                    () => setTeamPanelOpen(true),
                  )}
                />
              </div>
              <TeamCompositionPanel
                open={teamPanelOpen}
                onOpenChange={setTeamPanelOpen}
                recruitments={teamRecruitments}
              />
            </RadixDialog.Content>
          )}
        </RadixDialog.Portal>
      </RadixDialog.Root>

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        color="error"
        icon={<WarningTriangleIcon weight="fill" size={24} className="text-red-500" />}
        title="프로젝트를 삭제할까요?"
        description={
          <>
            삭제한 프로젝트는 복구할 수 없어요.
            <br />
            &apos;{deleteTarget?.projectName}&apos; 프로젝트를 삭제하시겠어요?
          </>
        }
        cancelLabel="돌아가기"
        confirmLabel="삭제하기"
        onConfirm={handleDeleteConfirm}
      />
    </main>
  );
};

export default ProjectsPage;
