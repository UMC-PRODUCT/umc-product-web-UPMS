import {
  FormAttachmentField,
  FormChoiceList,
  FormQuestion,
  FormSection,
  FormTextAnswer,
} from '@umc-product/react';

export type ApplicationFormAnswer =
  | { type: 'TEXT'; text: string }
  | {
      type: 'CHOICE';
      multiple: boolean;
      options: { value: string; label: string }[];
      selected: string[];
    }
  | { type: 'ATTACHMENT'; label: string; href?: string };

export type ApplicationFormSection = {
  sectionId: string;
  title: string; // 예: 공통 문항, Design
  questions: {
    questionId: string;
    number: string; // 예: 01
    title: string;
    required: boolean;
    answer: ApplicationFormAnswer;
  }[];
};

// 제출한 보기를 처음 값으로 두고 다시 고를 수 있음
// TODO: 바뀐 선택을 저장하는 API 연동
const Answer = ({ answer }: { answer: ApplicationFormAnswer }) => {
  switch (answer.type) {
    case 'TEXT':
      return <FormTextAnswer value={answer.text} readOnly />;
    case 'CHOICE':
      return answer.multiple ? (
        <FormChoiceList type="multiple" options={answer.options} defaultValue={answer.selected} />
      ) : (
        <FormChoiceList type="single" options={answer.options} defaultValue={answer.selected[0]} />
      );
    case 'ATTACHMENT':
      return (
        <FormAttachmentField attachment={{ label: answer.label, href: answer.href }} readOnly />
      );
  }
};

type ApplicationFormProps = {
  sections: ApplicationFormSection[];
  readOnly?: boolean; // 보기 선택도 못 바꿈 (어드민이 보는 지원서)
  className?: string;
};

// 제출한 지원서를 보여 줌. 문항 묶음(섹션)마다 질문과 답을 늘어놓음
const ApplicationForm = ({ sections, readOnly = false, className = '' }: ApplicationFormProps) => (
  <div className={`flex w-full flex-col gap-8 ${className}`}>
    {sections.map(({ sectionId, title, questions }) => (
      // 피그마 Section Control: FormSection toggle 헤더에서 스위치만 숨김 (제출한 지원서는 섹션을 끄고 켤 수 없음)
      <FormSection
        key={sectionId}
        variant="toggle"
        title={title}
        className="[&_.umc-form-section\_\_switch]:hidden"
      >
        <div className="flex flex-col gap-10 px-5 pt-8 pb-6">
          {questions.map(({ questionId, number, title: questionTitle, required, answer }) => (
            <FormQuestion
              key={questionId}
              number={number}
              title={questionTitle}
              required={required}
              readOnly={readOnly}
            >
              <Answer answer={answer} />
            </FormQuestion>
          ))}
        </div>
      </FormSection>
    ))}
  </div>
);

export default ApplicationForm;
