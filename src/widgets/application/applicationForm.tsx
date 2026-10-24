import { Checkbox, FormAttachmentField } from '@umc-product/react';
import { useState } from 'react';

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
    number: string; // 예: Q1
    title: string;
    required: boolean;
    answer: ApplicationFormAnswer;
  }[];
};

// default: 챌린저가 보는 내 지원서
// compact: 어드민 · PM이 보는 지원자 지원서. 글자 · 여백이 작고, 첫 묶음(공통 문항)은 제목 없이 위 프로젝트 헤더에 붙음
export type ApplicationFormVariant = 'default' | 'compact';

const VARIANT_CLASS: Record<
  ApplicationFormVariant,
  {
    form: string;
    list: string;
    question: string;
    number: string;
    answer: string;
    text: string;
    choice: string;
    attachment: string;
  }
> = {
  default: {
    form: 'gap-8',
    list: 'gap-10 px-5 pt-[34px] pb-[38px]',
    question: 'gap-1.5 text-heading-4-semibold',
    number: 'w-7',
    answer: 'pl-5',
    text: 'px-5 py-4 text-body-1-regular',
    choice: '',
    attachment: '',
  },
  compact: {
    form: 'gap-5',
    list: 'gap-8 px-2 py-[26px]',
    question: 'gap-1 text-body-3-semibold',
    number: 'min-w-5',
    answer: 'pl-3.5',
    text: 'px-4 py-3 text-body-3-medium',
    choice: '[--umc-checkbox-font-size:var(--umc-typography-label-5-medium-font-size)]',
    // 첨부 칸(data-size가 붙은 입력 상자)의 높이 · 글자 크기를 줄임
    attachment:
      '[&>[data-size]]:[--umc-input-box-height:45px] [&>[data-size]]:[--umc-input-box-font-size:var(--umc-typography-body-3-medium-font-size)]',
  },
};

const ANSWER_BOX_CLASS = 'w-full rounded-xl border border-teal-grey-75 bg-white';

// 피그마 첨부 칸 테두리(#eff0f0): 디자인 시스템 입력 상자 기본 테두리보다 연하게
const ATTACHMENT_BORDER_CLASS =
  '[&>[data-size]]:[--umc-input-box-border-color:var(--umc-color-border-neutral-weaker-100)]';

type ChoiceAnswerProps = {
  answer: Extract<ApplicationFormAnswer, { type: 'CHOICE' }>;
  readOnly: boolean;
  className: string;
};

// 제출한 보기를 처음 값으로 두고 다시 고를 수 있음. 단일 선택이면 하나만 남김
// TODO: 바뀐 선택을 저장하는 API 연동
const ChoiceAnswer = ({ answer, readOnly, className }: ChoiceAnswerProps) => {
  const [selected, setSelected] = useState(answer.selected);

  const toggle = (value: string, checked: boolean) => {
    if (!answer.multiple) return setSelected(checked ? [value] : []);
    setSelected((prev) => (checked ? [...prev, value] : prev.filter((item) => item !== value)));
  };

  return (
    <ul className={`${ANSWER_BOX_CLASS} flex flex-col gap-0.5 p-1`}>
      {answer.options.map(({ value, label }) => (
        <li key={value} className="p-2">
          <Checkbox
            color="brand"
            labelPlacement="end"
            readOnly={readOnly}
            checked={selected.includes(value)}
            onCheckedChange={(checked) => toggle(value, checked)}
            className={className}
          >
            {label}
          </Checkbox>
        </li>
      ))}
    </ul>
  );
};

type AnswerProps = {
  answer: ApplicationFormAnswer;
  readOnly: boolean;
  variant: ApplicationFormVariant;
};

const Answer = ({ answer, readOnly, variant }: AnswerProps) => {
  const variantClass = VARIANT_CLASS[variant];

  switch (answer.type) {
    case 'TEXT':
      return (
        <p
          className={`${ANSWER_BOX_CLASS} ${variantClass.text} whitespace-pre-wrap text-teal-grey-900`}
        >
          {answer.text}
        </p>
      );
    case 'CHOICE':
      return <ChoiceAnswer answer={answer} readOnly={readOnly} className={variantClass.choice} />;
    case 'ATTACHMENT':
      return (
        <FormAttachmentField
          attachment={{ label: answer.label, href: answer.href }}
          readOnly
          className={`${ATTACHMENT_BORDER_CLASS} ${variantClass.attachment}`}
        />
      );
  }
};

type ApplicationFormProps = {
  sections: ApplicationFormSection[];
  variant?: ApplicationFormVariant;
  readOnly?: boolean; // 보기 선택도 못 바꿈 (어드민이 보는 지원서)
  className?: string;
};

// 제출한 지원서를 읽기 전용으로 보여 줌. 문항 묶음(섹션)마다 질문과 답을 늘어놓음
const ApplicationForm = ({
  sections,
  variant = 'default',
  readOnly = false,
  className = '',
}: ApplicationFormProps) => {
  const variantClass = VARIANT_CLASS[variant];

  return (
    <div className={`flex w-full flex-col ${variantClass.form} ${className}`}>
      {sections.map(({ sectionId, title, questions }, index) => {
        const untitled = variant === 'compact' && index === 0;

        return (
          <section
            key={sectionId}
            aria-label={untitled ? title : undefined}
            className="flex flex-col"
          >
            {!untitled && (
              <h3 className="rounded-t-xl border border-b-0 border-teal-300 bg-teal-100 py-2 pr-5 pl-[30px] text-heading-4-semibold text-teal-600">
                {title}
              </h3>
            )}
            <ol
              className={`flex flex-col rounded-b-xl border border-teal-200 ${variantClass.list}`}
            >
              {questions.map(({ questionId, number, title: questionTitle, required, answer }) => (
                <li key={questionId} className="flex flex-col gap-2.5 px-1.5">
                  <p className={`flex items-start px-1.5 ${variantClass.question}`}>
                    <span className={`shrink-0 text-teal-600 ${variantClass.number}`}>
                      {number}
                    </span>
                    <span className="flex-1 text-teal-grey-900">
                      {questionTitle}
                      {required && (
                        <span aria-label="필수" className="text-red-600">
                          *
                        </span>
                      )}
                    </span>
                  </p>
                  <div className={variantClass.answer}>
                    <Answer answer={answer} readOnly={readOnly} variant={variant} />
                  </div>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
};

export default ApplicationForm;
