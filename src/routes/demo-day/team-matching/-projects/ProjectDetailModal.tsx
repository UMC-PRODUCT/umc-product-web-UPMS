import { useNavigate } from '@tanstack/react-router';
import { UsersPictogram } from '@umc-product/icons';
import { Button, Dimmed } from '@umc-product/react';
import { Dialog } from 'radix-ui';
import { useState } from 'react';

import {
  getRecruitmentRows,
  type Project,
  type ProjectActions,
  type ProjectPeriod,
  TeamCompositionPanel,
} from '@/features/project-list';
import { ProjectCard } from '@/widgets/card';
import { useAppToast } from '@/widgets/toast';

type ProjectDetailModalProps = {
  project: Project | null; // null이면 닫힘
  period: ProjectPeriod;
  actions: ProjectActions | null;
  onClose: () => void;
};

// 프로젝트 목록에서 카드를 누르면 뜨는 상세 모달. 하단 버튼은 권한 · 기간에 따라 달라짐
const ProjectDetailModal = ({ project, period, actions, onClose }: ProjectDetailModalProps) => {
  const [teamPanelOpen, setTeamPanelOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useAppToast();

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    setTeamPanelOpen(false);
    onClose();
  };

  const handlePrimaryClick = () => {
    if (actions?.primary?.kind === 'EDIT_PROJECT') {
      navigate({ to: '/demo-day/project-settings/projects' });
      return;
    }
    // TODO: 지원하기 · 내 지원서 보기 · 모집 문항 보기 화면 연동
    toast.show('준비 중인 기능이에요.');
  };

  return (
    <Dialog.Root open={project !== null} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <Dimmed />
        </Dialog.Overlay>
        {project && actions && (
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed top-1/2 left-1/2 z-(--umc-z-dimmed) max-h-[calc(100vh-40px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[20px] outline-none"
          >
            <Dialog.Title className="sr-only">{project.projectName}</Dialog.Title>
            <ProjectCard
              projectName={project.projectName}
              logoUrl={project.logoUrl}
              thumbnailUrl={project.thumbnailUrl}
              pmName={project.pmName}
              schoolName={project.schoolName}
              description={project.description}
              recruitments={getRecruitmentRows(project, period, 'detail')}
              actionNotice={actions.primary?.notice ?? undefined}
              actions={
                <>
                  {actions.showTeamButton && (
                    <Button
                      variant="weak"
                      color="neutral"
                      size="md"
                      icon={<UsersPictogram size={30} />}
                      aria-label="팀원 구성 보기"
                      onClick={() => setTeamPanelOpen(true)}
                    />
                  )}
                  <Button
                    variant="weak"
                    size="md"
                    className="flex-1"
                    disabled={project.planUrl === null}
                    onClick={() => window.open(project.planUrl ?? '', '_blank', 'noopener')}
                  >
                    기획보기
                  </Button>
                  {actions.primary && (
                    <Button
                      size="md"
                      className="flex-1"
                      disabled={actions.primary.disabled}
                      onClick={handlePrimaryClick}
                    >
                      {actions.primary.label}
                    </Button>
                  )}
                </>
              }
            />
            <TeamCompositionPanel
              open={teamPanelOpen}
              onOpenChange={setTeamPanelOpen}
              recruitments={project.recruitments}
            />
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ProjectDetailModal;
