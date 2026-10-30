import { useQuery } from '@tanstack/react-query';
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

import { getApplicationForm } from '@/features/project-register/api/applicationForm';

type RecruitmentFormPreviewModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
  pmName: string;
  schoolName: string;
  logoUrl: string | null;
};

const RecruitmentFormPreviewModal = ({
  open,
  onOpenChange,
  projectId,
  projectName,
  pmName,
  schoolName,
  logoUrl,
}: RecruitmentFormPreviewModalProps) => {
  const { data } = useQuery({
    queryKey: ['application-form', projectId],
    queryFn: () => getApplicationForm(Number(projectId)),
    enabled: open,
  });
  const formSections = data?.sections ?? [];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
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
                thumbnail={<ImageThumbnail src={logoUrl} alt={`${projectName} 로고`} size={50} />}
                title={projectName}
                subtitle={`${pmName} · ${schoolName}`}
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
                            options={q.options.map((o) => ({ value: o.content, label: o.content }))}
                          />
                        )}
                        {q.type === 'CHECKBOX' && (
                          <FormChoiceList
                            type="multiple"
                            disabled
                            options={q.options.map((o) => ({ value: o.content, label: o.content }))}
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
  );
};

export default RecruitmentFormPreviewModal;
