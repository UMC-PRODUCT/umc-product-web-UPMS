import { AddIcon } from '@umc-product/icons';
import { Button, PageHeader } from '@umc-product/react';
import { useState } from 'react';

import { type Role, useSessionStore, type View } from '@/entities/session';
import { ChapterSelectHeader, useVisibleChapters } from '@/features/chapter-select';
import { ProjectManagementCard } from '@/features/project-management';

import EmptyDocumentIcon from './assets/empty-document.svg?react';
import { MOCK_PM_PROJECTS, MOCK_PROJECTS } from './mock';

const BREADCRUMBS = [
  { label: '데모데이 매칭', href: '/demo-day' },
  { label: '프로젝트 설정', href: '/demo-day/project-settings/notice' },
  { label: '프로젝트 관리' },
];

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

// 중앙운영진(HQ_ADMIN)은 조회 전용 → 등록 버튼 미노출
const canRegisterProject = (role: Role) => role !== 'HQ_ADMIN';

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
          {canRegisterProject(role) && (
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
    </main>
  );
};

export default ProjectsPage;
