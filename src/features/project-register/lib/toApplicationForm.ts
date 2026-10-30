import type { ApplicationFormResponse, UpsertApplicationFormRequest } from '../api/applicationForm';
import type {
  PePlatform,
  ProjectDraft,
  ProjectQuestion,
  QuestionSectionKey,
  QuestionType,
} from '../model/types';

type FormSection = UpsertApplicationFormRequest['sections'][number];
type FormQuestion = FormSection['questions'][number];
type ServerPart = NonNullable<FormSection['allowedParts']>[number];

const QUESTION_TYPE: Record<QuestionType, FormQuestion['type']> = {
  SHORT: 'SHORT_TEXT',
  LONG: 'LONG_TEXT',
  SINGLE: 'RADIO',
  MULTIPLE: 'CHECKBOX',
  FILE: 'FILE',
  PORTFOLIO: 'PORTFOLIO',
};

const FROM_SERVER_TYPE = Object.fromEntries(
  Object.entries(QUESTION_TYPE).map(([type, serverType]) => [serverType, type]),
) as Record<string, QuestionType>;

const PE_PART: Record<PePlatform, ServerPart> = {
  WEB: 'WEB_PRODUCT_ENGINEER',
  MOBILE: 'MOBILE_PRODUCT_ENGINEER',
};

const SECTION_TITLE: Record<QuestionSectionKey, string> = {
  COMMON: '공통 문항',
  DESIGN: 'Design 문항',
  PE: 'PE 문항',
};

const toQuestion = (
  { type, title, description, required, choices }: ProjectQuestion,
  index: number,
): FormQuestion => ({
  type: QUESTION_TYPE[type],
  title,
  description,
  isRequired: required,
  orderNo: index + 1,
  options: choices.map(({ label }, optionIndex) => ({
    content: label,
    orderNo: optionIndex + 1,
  })),
});

// 플랫폼을 아직 모르면(모집 정보 전) PE 문항은 Web · Mobile PE 모두 대상
const getPeParts = (pePlatform: PePlatform | null): ServerPart[] =>
  pePlatform ? [PE_PART[pePlatform]] : [PE_PART.WEB, PE_PART.MOBILE];

// 화면 문항 → 지원 폼 저장 요청. 공통 문항은 항상, Design · PE 섹션은 켜 둔 것만 보냄
export const toApplicationFormRequest = ({
  questions,
  sectionEnabled,
  recruit,
}: ProjectDraft): UpsertApplicationFormRequest => {
  const sections: FormSection[] = [
    {
      type: 'COMMON',
      title: SECTION_TITLE.COMMON,
      orderNo: 1,
      questions: questions.COMMON.map(toQuestion),
    },
  ];
  if (sectionEnabled.DESIGN) {
    sections.push({
      type: 'PART',
      allowedParts: ['DESIGN'],
      title: SECTION_TITLE.DESIGN,
      orderNo: sections.length + 1,
      questions: questions.DESIGN.map(toQuestion),
    });
  }
  if (sectionEnabled.PE) {
    sections.push({
      type: 'PART',
      allowedParts: getPeParts(recruit.pePlatform),
      title: SECTION_TITLE.PE,
      orderNo: sections.length + 1,
      questions: questions.PE.map(toQuestion),
    });
  }
  return { title: '지원서', sections };
};

// 지원 폼 → 화면 문항. 서버 ID는 화면 안에서만 쓰는 문자열 ID로 씀
export const fromApplicationForm = (
  form: ApplicationFormResponse | null | undefined,
): Pick<ProjectDraft, 'questions' | 'sectionEnabled'> => {
  const result: Pick<ProjectDraft, 'questions' | 'sectionEnabled'> = {
    questions: { COMMON: [], DESIGN: [], PE: [] },
    sectionEnabled: { DESIGN: false, PE: false },
  };

  [...(form?.sections ?? [])]
    .sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0))
    .forEach(({ type, allowedParts, questions }) => {
      const key: QuestionSectionKey =
        type === 'COMMON' ? 'COMMON' : allowedParts?.includes('DESIGN') ? 'DESIGN' : 'PE';
      if (key !== 'COMMON') result.sectionEnabled[key] = true;
      result.questions[key] = [...questions]
        .sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0))
        .map((question, index) => ({
          id: `server-${key}-${question.questionId ?? index}`,
          type: FROM_SERVER_TYPE[question.type] ?? 'SHORT',
          title: question.title,
          description: question.description ?? '',
          required: question.isRequired ?? true,
          choices: [...(question.options ?? [])]
            .sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0))
            .map((option, optionIndex) => ({
              id: `server-${key}-${question.questionId ?? index}-${option.optionId ?? optionIndex}`,
              label: option.content,
            })),
        }));
    });

  return result;
};
