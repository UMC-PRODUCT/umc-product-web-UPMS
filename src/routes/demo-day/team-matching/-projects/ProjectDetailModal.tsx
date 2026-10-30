import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { UsersPictogram } from '@umc-product/icons';
import {
  Button,
  Dimmed,
  FormAttachmentField,
  FormChoiceList,
  FormHeader,
  FormQuestion,
  FormSection,
  FormSheet,
  FormTextAnswer,
  ImageThumbnail,
} from '@umc-product/react';
import { Dialog } from 'radix-ui';
import { useState } from 'react';

import {
  getRecruitmentRows,
  type Project,
  type ProjectActions,
  type ProjectPeriod,
  TeamCompositionPanel,
} from '@/features/project-list';
import { getApplicationForm } from '@/features/project-register/api/applicationForm';
import { ProjectCard } from '@/widgets/card';

type ProjectDetailModalProps = {
  project: Project | null; // null이면 닫힘
  period: ProjectPeriod;
  actions: ProjectActions | null;
  onClose: () => void;
};

// 프로젝트 목록에서 카드를 누르면 뜨는 상세 모달. 하단 버튼은 권한 · 기간에 따라 달라짐
const ProjectDetailModal = ({ project, period, actions, onClose }: ProjectDetailModalProps) => {
  const [teamPanelOpen, setTeamPanelOpen] = useState(false);
  const [recruitmentFormOpen, setRecruitmentFormOpen] = useState(false);
  const navigate = useNavigate();

  const { data: applicationFormData } = useQuery({
    queryKey: ['application-form', project?.projectId],
    queryFn: () => getApplicationForm(Number(project!.projectId)),
    enabled: recruitmentFormOpen && project !== null,
  });
  const formSections = applicationFormData?.sections ?? [];

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    setTeamPanelOpen(false);
    setRecruitmentFormOpen(false);
    onClose();
  };

  const handlePrimaryClick = () => {
    if (actions?.primary?.kind === 'EDIT_PROJECT') {
      navigate({ to: '/demo-day/project-settings/projects' });
      return;
    }
    if (actions?.primary?.kind === 'RECRUIT_QUESTIONS') {
      setRecruitmentFormOpen(true);
      return;
    }
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
            <Dialog.Root open={recruitmentFormOpen} onOpenChange={setRecruitmentFormOpen}>
              <Dialog.Portal>
                <Dialog.Overlay asChild>
                  <Dimmed />
                </Dialog.Overlay>
                <Dialog.Content
                  aria-describedby={undefined}
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  className="fixed top-1/2 left-1/2 z-(--umc-z-dimmed) max-h-[calc(100vh-40px)] w-[928px] max-w-[calc(100vw-40px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[20px] outline-none"
                >
                  <Dialog.Title className="sr-only">모집 문항 미리보기</Dialog.Title>
                  <FormSheet
                    header={
                      <FormHeader
                        thumbnail={
                          <ImageThumbnail
                            src={project.logoUrl}
                            alt={`${project.projectName} 로고`}
                            size={50}
                          />
                        }
                        title={project.projectName}
                        subtitle={`${project.pmName} · ${project.schoolName}`}
                      />
                    }
                    control={
                      <Button size="lg" disabled>
                        다음
                      </Button>
                    }
                  >
                    <div className="flex flex-col gap-6">
                      {formSections.map((section, si) => (
                        <FormSection key={section.sectionId ?? si} title={section.title}>
                          <div className="flex flex-col gap-10 px-5 pt-8 pb-6">
                            {section.questions.map((q, qi) => (
                              <FormQuestion
                                key={q.questionId ?? qi}
                                number={String(qi + 1).padStart(2, '0')}
                                title={q.title}
                                description={q.description}
                                required={q.isRequired}
                              >
                                {(q.type === 'SHORT_TEXT' || q.type === 'LONG_TEXT') && (
                                  <FormTextAnswer disabled placeholder="작성하세요" />
                                )}
                                {(q.type === 'RADIO' || q.type === 'DROPDOWN') && (
                                  <FormChoiceList
                                    type="single"
                                    disabled
                                    options={q.options.map((o) => ({
                                      value: o.content,
                                      label: o.content,
                                    }))}
                                  />
                                )}
                                {q.type === 'CHECKBOX' && (
                                  <FormChoiceList
                                    type="multiple"
                                    disabled
                                    options={q.options.map((o) => ({
                                      value: o.content,
                                      label: o.content,
                                    }))}
                                  />
                                )}
                                {(q.type === 'FILE' || q.type === 'PORTFOLIO') && (
                                  <FormAttachmentField disabled />
                                )}
                              </FormQuestion>
                            ))}
                          </div>
                        </FormSection>
                      ))}
                    </div>
                  </FormSheet>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ProjectDetailModal;
