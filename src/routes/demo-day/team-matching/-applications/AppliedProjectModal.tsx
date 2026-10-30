import { UsersPictogram } from '@umc-product/icons';
import { Button, Dimmed } from '@umc-product/react';
import { Dialog } from 'radix-ui';
import { useState } from 'react';

import {
  type AppliedProject,
  getVisibleRecruitments,
  type RecruitPart,
  useProjectDetail,
} from '@/features/applications';
import { ProjectCard } from '@/widgets/card';
import { CancelApplicationDialog } from '@/widgets/dialog';

import MyApplicationView from './MyApplicationView';

// 상세 카드는 PE를 플랫폼 이름으로만 표기
const PART_LABEL: Record<RecruitPart, string> = {
  DESIGN: 'Design',
  WEB_PE: 'Web',
  MOBILE_PE: 'Mobile',
};

type ModalView = 'PROJECT' | 'APPLICATION';

type AppliedProjectModalProps = {
  project: AppliedProject | null; // null이면 닫힘
  onClose: () => void;
  // 지원 취소 확정. 성공하면 부모가 project를 null로 바꿔 모달을 닫음
  onCancelApplication: (project: AppliedProject) => void;
  isCanceling: boolean; // 취소 요청 중 (버튼 중복 클릭 방지)
};

// 내 지원 현황에서 카드를 누르면 뜨는 모달. 프로젝트 상세 → 내 지원서 보기로 넘어감
const AppliedProjectModal = ({
  project,
  onClose,
  onCancelApplication,
  isCanceling,
}: AppliedProjectModalProps) => {
  const [view, setView] = useState<ModalView>('PROJECT');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  // 목록 API에 없는 소개 · 로고는 모달을 열 때 프로젝트 상세로 불러옴
  const { data: detail } = useProjectDetail(project?.projectId ?? null);

  const close = () => {
    setView('PROJECT');
    onClose();
  };

  // 지원서 화면에서 딤 · ESC를 누르면 닫지 않고 프로젝트 상세로 돌아감
  const handleOpenChange = (open: boolean) => {
    if (open) return;
    if (view === 'APPLICATION') setView('PROJECT');
    else close();
  };

  const handleCancelConfirm = () => {
    if (!project) return;
    setCancelDialogOpen(false);
    onCancelApplication(project);
  };

  return (
    <Dialog.Root open={project !== null} onOpenChange={handleOpenChange}>
      {/* 모달 내용은 딤과 같은 층에 두고(딤보다 뒤에 그려져 위로 옴), 그 위 dialog 층은 지원 취소 경고창이 씀 */}
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <Dimmed />
        </Dialog.Overlay>
        {project && view === 'PROJECT' && (
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed top-1/2 left-1/2 z-(--umc-z-dimmed) -translate-x-1/2 -translate-y-1/2 outline-none"
          >
            <Dialog.Title className="sr-only">{project.projectName}</Dialog.Title>
            <ProjectCard
              projectName={project.projectName}
              logoUrl={detail?.logoUrl ?? null}
              thumbnailUrl={project.thumbnailUrl}
              pmName={project.pmName}
              schoolName={project.schoolName}
              description={detail?.description ?? ''}
              recruitments={getVisibleRecruitments(project).map(({ part, ...recruitment }) => ({
                ...recruitment,
                label: PART_LABEL[part],
              }))}
              actions={
                // TODO: 팀원 보기 연동 (프로젝트 목록의 팀원 구성 패널과 같은 화면, 기획 확인 필요)
                <>
                  <Button
                    variant="weak"
                    color="neutral"
                    size="md"
                    icon={<UsersPictogram size={30} />}
                    aria-label="팀원 보기"
                  />
                  {/* 기획 링크를 새 탭으로. 상세를 불러오기 전이나 링크가 없으면 비활성 */}
                  <Button
                    variant="weak"
                    size="md"
                    className="flex-1"
                    disabled={!detail?.planUrl}
                    onClick={() =>
                      detail?.planUrl &&
                      window.open(detail.planUrl, '_blank', 'noopener,noreferrer')
                    }
                  >
                    기획보기
                  </Button>
                  {/* 랜덤 매칭으로 확정된 카드는 지원서가 없음 */}
                  {project.applicationId !== null && (
                    <Button size="md" className="flex-1" onClick={() => setView('APPLICATION')}>
                      내 지원서 보기
                    </Button>
                  )}
                </>
              }
            />
          </Dialog.Content>
        )}
        {project && project.applicationId !== null && view === 'APPLICATION' && (
          // 지원서가 길어 화면 전체를 스크롤 영역으로 씀. 빈 곳(딤)을 누르면 이전 화면으로
          <Dialog.Content
            aria-describedby={undefined}
            onPointerDown={(event) => {
              if (event.target === event.currentTarget) setView('PROJECT');
            }}
            // 화면 전체를 덮어서 바깥 클릭은 위에 뜬 경고창뿐. 경고창이 떠 있으면 ESC도 경고창만 닫음
            onInteractOutside={(event) => event.preventDefault()}
            onEscapeKeyDown={(event) => cancelDialogOpen && event.preventDefault()}
            className="fixed inset-0 z-(--umc-z-dimmed) flex justify-center overflow-y-auto pt-[143px] pb-20 outline-none"
          >
            <Dialog.Title className="sr-only">{project.projectName} 내 지원서</Dialog.Title>
            <MyApplicationView
              project={project}
              applicationId={project.applicationId}
              logoUrl={detail?.logoUrl ?? null}
              description={detail?.description ?? ''}
              isCanceling={isCanceling}
              onCancelClick={() => setCancelDialogOpen(true)}
            />
          </Dialog.Content>
        )}
        {project && (
          <CancelApplicationDialog
            // 아래 radix 모달이 body 클릭을 막아서(pointer-events: none) 경고창만 다시 열어 줌
            className="pointer-events-auto"
            open={cancelDialogOpen}
            onOpenChange={setCancelDialogOpen}
            projectName={project.projectName}
            onConfirm={handleCancelConfirm}
          />
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AppliedProjectModal;
