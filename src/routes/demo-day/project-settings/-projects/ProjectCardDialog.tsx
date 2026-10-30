import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { UsersPictogram } from '@umc-product/icons';
import { Button, Dimmed } from '@umc-product/react';
import { Dialog } from 'radix-ui';
import { type ReactNode, useState } from 'react';

import { type Role, type View } from '@/entities/session';
import { useProjectDetail } from '@/features/applications';
import {
  getProjectMembers,
  TeamCompositionPanel,
  toTeamRecruitments,
} from '@/features/project-list';
import { type ManagedProject, type RecruitPart } from '@/features/project-management';
import ProjectCard from '@/widgets/card/projectCard';

import RecruitmentFormPreviewModal from './RecruitmentFormPreviewModal';

const PART_LABEL: Record<RecruitPart, string> = {
  DESIGN: 'Design',
  WEB_PE: 'Web PE',
  MOBILE_PE: 'Mobile PE',
};

const getProjectDetailActions = (
  role: Role,
  view: View,
  isApplicationPeriod: boolean,
  isMatchingPeriod: boolean,
  planUrl: string | null,
  onEditProject: () => void,
  onTeamClick: () => void,
  onViewRecruitment: () => void,
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
    <Button size="md" className="flex-1" onClick={onViewRecruitment}>
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

  if (isApplicationPeriod) {
    return (
      <>
        {usersButton}
        {planButton}
        {recruitButton}
      </>
    );
  }

  if (view === 'PM_CHALLENGER') {
    return (
      <>
        {usersButton}
        {planButton}
        {editButton}
      </>
    );
  }

  if (isMatchingPeriod) {
    return (
      <>
        {usersButton}
        {planButton}
        {recruitButtonDisabled}
      </>
    );
  }

  if (role === 'CHAPTER_ADMIN') {
    return (
      <>
        {usersButton}
        {planButton}
        {recruitButton}
      </>
    );
  }

  return (
    <>
      {usersButton}
      {planButton}
      {editButton}
    </>
  );
};

type ProjectCardDialogProps = {
  project: ManagedProject | null;
  role: Role;
  view: View;
  isApplicationPeriod: boolean;
  isMatchingPeriod: boolean;
  onClose: () => void;
};

const ProjectCardDialog = ({
  project,
  role,
  view,
  isApplicationPeriod,
  isMatchingPeriod,
  onClose,
}: ProjectCardDialogProps) => {
  const [teamPanelOpen, setTeamPanelOpen] = useState(false);
  const [recruitmentFormOpen, setRecruitmentFormOpen] = useState(false);
  const navigate = useNavigate();

  const { data: projectDetail } = useProjectDetail(project ? Number(project.projectId) : null);
  const planUrl = projectDetail?.planUrl ?? null;

  const { data: teamMembersData } = useQuery({
    queryKey: ['project-members', project?.projectId],
    queryFn: () => getProjectMembers(Number(project!.projectId)),
    enabled: project !== null,
  });
  const teamRecruitments = toTeamRecruitments(project?.recruitments ?? [], teamMembersData);

  return (
    <Dialog.Root
      open={project !== null}
      onOpenChange={(open) => {
        if (!open) {
          setTeamPanelOpen(false);
          setRecruitmentFormOpen(false);
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <Dimmed />
        </Dialog.Overlay>
        {project && (
          <Dialog.Content
            aria-describedby={undefined}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              (event.currentTarget as HTMLElement).focus();
            }}
            className="fixed top-1/2 left-1/2 z-(--umc-z-dimmed) -translate-x-1/2 -translate-y-1/2 outline-none"
          >
            <div className="relative">
              <Dialog.Title className="sr-only">{project.projectName}</Dialog.Title>
              <ProjectCard
                projectName={project.projectName}
                logoUrl={projectDetail?.logoUrl ?? null}
                thumbnailUrl={project.thumbnailUrl}
                pmName={project.pmName}
                schoolName={project.schoolName}
                description={project.description}
                recruitments={project.recruitments.map((r) => ({
                  label: PART_LABEL[r.part],
                  applied: r.applied,
                  capacity: r.capacity,
                  status: r.status,
                }))}
                actions={getProjectDetailActions(
                  role,
                  view,
                  isApplicationPeriod,
                  isMatchingPeriod,
                  planUrl,
                  () =>
                    navigate({
                      to: '/demo-day/project-settings/projects/$projectId',
                      params: { projectId: project.projectId },
                    }),
                  () => setTeamPanelOpen(true),
                  () => setRecruitmentFormOpen(true),
                )}
              />
            </div>
            <TeamCompositionPanel
              open={teamPanelOpen}
              onOpenChange={setTeamPanelOpen}
              recruitments={teamRecruitments}
            />
            <RecruitmentFormPreviewModal
              open={recruitmentFormOpen}
              onOpenChange={setRecruitmentFormOpen}
              projectId={project.projectId}
              projectName={project.projectName}
              pmName={project.pmName}
              schoolName={project.schoolName}
              logoUrl={projectDetail?.logoUrl ?? null}
            />
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ProjectCardDialog;
