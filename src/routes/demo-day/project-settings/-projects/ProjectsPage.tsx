import { AddIcon, UsersPictogram } from '@umc-product/icons';
import { Button, Dimmed, PageHeader } from '@umc-product/react';
import { Dialog } from 'radix-ui';
import { type ReactNode, useState } from 'react';

import { type Role, useSessionStore, type View } from '@/entities/session';
import { ChapterSelectHeader, useVisibleChapters } from '@/features/chapter-select';
import {
  type ManagedProject,
  ProjectManagementCard,
  type RecruitPart,
} from '@/features/project-management';
import ProjectCard from '@/widgets/card/projectCard';

import EmptyDocumentIcon from './assets/empty-document.svg?react';
import { MOCK_PM_PROJECTS, MOCK_PROJECTS } from './mock';

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
  project: ManagedProject,
  ownChapterId: string,
  isApplicationPeriod: boolean,
  isMatchingPeriod: boolean,
): ReactNode => {
  const usersButton = (
    <Button
      variant="weak"
      color="neutral"
      size="md"
      icon={<UsersPictogram size={30} color="var(--color-icon-subtle)" />}
      aria-label="팀원 현황"
    />
  );

  const planButton = (
    <Button variant="weak" size="md" className="flex-1">
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

  // 지원 기간: 모든 역할·지부에 관계없이 기획 보기 + 모집 문항 보기
  if (isApplicationPeriod) {
    return (
      <>
        {planButton}
        {recruitButton}
      </>
    );
  }

  // PM 챌린저 - 자신의 프로젝트만 조회하므로 기획 보기 + 프로젝트 수정하기
  if (view === 'PM_CHALLENGER') {
    return (
      <>
        {usersButton}
        {planButton}
        <Button size="md" className="flex-1">
          프로젝트 수정하기
        </Button>
      </>
    );
  }

  // 매칭 기간 (어드민): 기획 보기 + 모집 문항 보기(비활성화)
  if (isMatchingPeriod) {
    return (
      <>
        {planButton}
        {recruitButtonDisabled}
      </>
    );
  }

  // 기본 - Admin(중앙), SUPER_ADMIN, 소속 지부 지부장
  if (
    role === 'HQ_ADMIN' ||
    role === 'SUPER_ADMIN' ||
    (role === 'HQ_LEAD' && project.chapterId === ownChapterId)
  ) {
    return (
      <>
        {usersButton}
        {planButton}
        <Button size="md" className="flex-1">
          프로젝트 수정하기
        </Button>
      </>
    );
  }

  // 기본 - 타 지부 지부장, 학교 운영진(CHAPTER_ADMIN)
  if (role === 'HQ_LEAD' || role === 'CHAPTER_ADMIN') {
    return (
      <>
        {usersButton}
        {planButton}
        {recruitButton}
      </>
    );
  }

  return planButton;
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
const EmptyState = ({ showRegisterButton }: { showRegisterButton: boolean }) => (
  <div className="flex flex-col items-center gap-6 py-20">
    <EmptyDocumentIcon width={56} height={56} className="text-teal-grey-200" />
    <div className="flex flex-col items-center gap-2">
      <p className="text-title-3-medium text-placeholder">등록된 프로젝트가 없어요</p>
      <p className="text-heading-5-medium text-placeholder">
        챌린저들이 프로젝트를 등록한 후 확인할 수 있어요.
      </p>
    </div>
    {showRegisterButton && (
      <Button size="sm">
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
  const ownChapterId = useSessionStore((state) => state.session.chapterId);
  const chapters = useVisibleChapters();
  const [chapterId, setChapterId] = useState(
    () => chapters.find((c) => c.id === ownChapterId)?.id ?? chapters[0]?.id ?? '',
  );
  const [selectedProject, setSelectedProject] = useState<ManagedProject | null>(null);

  // TODO: API 연동 - 현재 지원 기간 여부
  const isApplicationPeriod = false;
  // TODO: API 연동 - 현재 매칭 기간 여부
  const isMatchingPeriod = false;

  const isPmChallenger = view === 'PM_CHALLENGER';

  // TODO: API 연동 (PM 챌린저: 본인 프로젝트 / 어드민: 지부별 프로젝트 목록)
  const projects = isPmChallenger
    ? MOCK_PM_PROJECTS
    : MOCK_PROJECTS.filter((p) => p.chapterId === chapterId);

  return (
    <main className="flex flex-col items-start gap-8 px-8 pt-12 pb-20">
      <PageHeader
        className="w-full max-w-[1082px]"
        breadcrumbs={BREADCRUMBS}
        title="프로젝트 관리"
        description={getDescription(role, view)}
      />

      <div className="flex w-full max-w-[1082px] flex-col">
        <div className="flex items-center justify-between gap-4">
          {!isPmChallenger && (
            <ChapterSelectHeader value={chapterId} onValueChange={setChapterId} />
          )}
          {role !== 'HQ_ADMIN' && (
            <Button size="sm" className="ml-auto h-11 shrink-0">
              <div className="flex items-center gap-2">
                <AddIcon size={16} />
                프로젝트 등록
              </div>
            </Button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="flex min-h-[400px] w-full items-center justify-center rounded-xl border border-teal-grey-100 bg-white shadow-drop-neutral-3">
            <EmptyState showRegisterButton={isPmChallenger} />
          </div>
        ) : isPmChallenger ? (
          <ul className="mt-2 flex flex-col gap-[10px]">
            {projects.map((project) => (
              <li key={project.projectId}>
                <ProjectManagementCard
                  project={project}
                  role={role}
                  ownChapterId={ownChapterId ?? ''}
                  isPmChallenger
                  isMatchingPeriod={isMatchingPeriod}
                  onCardClick={() => setSelectedProject(project)}
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
                    <section className="mt-8 flex flex-col">
                      <h2 className="mb-[10px] text-title-2-semibold">Web</h2>
                      <ul className="flex flex-col gap-[10px]">
                        {webProjects.map((project) => (
                          <li key={project.projectId}>
                            <ProjectManagementCard
                              project={project}
                              role={role}
                              ownChapterId={ownChapterId ?? ''}
                              isApplicationPeriod={isApplicationPeriod}
                              isMatchingPeriod={isMatchingPeriod}
                              onCardClick={() => setSelectedProject(project)}
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
                              ownChapterId={ownChapterId ?? ''}
                              isApplicationPeriod={isApplicationPeriod}
                              isMatchingPeriod={isMatchingPeriod}
                              onCardClick={() => setSelectedProject(project)}
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
      </div>

      <Dialog.Root
        open={selectedProject !== null}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay asChild>
            <Dimmed />
          </Dialog.Overlay>
          {selectedProject && (
            <Dialog.Content
              aria-describedby={undefined}
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                (event.currentTarget as HTMLElement).focus();
              }}
              className="fixed top-1/2 left-1/2 z-(--umc-z-dimmed) -translate-x-1/2 -translate-y-1/2 outline-none"
            >
              <div className="relative">
                <Dialog.Title className="sr-only">{selectedProject.projectName}</Dialog.Title>
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
                    view,
                    selectedProject,
                    ownChapterId ?? '',
                    isApplicationPeriod,
                    isMatchingPeriod,
                  )}
                />
              </div>
            </Dialog.Content>
          )}
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
};

export default ProjectsPage;
