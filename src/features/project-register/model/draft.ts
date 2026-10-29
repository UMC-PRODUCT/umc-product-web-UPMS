import type {
  ProjectDraft,
  ProjectQuestion,
  QuestionSectionKey,
  QuestionType,
  RecruitInfo,
} from './types';

export const EMPTY_RECRUIT: RecruitInfo = { designCount: 0, peCount: 0, pePlatform: null };

export const createInitialDraft = (): ProjectDraft => ({
  thumbnail: null,
  logo: null,
  thumbnailUrl: '',
  logoUrl: '',
  name: '',
  description: '',
  planUrl: '',
  pmIds: [''],
  recruit: EMPTY_RECRUIT,
  questions: { COMMON: [], DESIGN: [], PE: [] },
  sectionEnabled: { DESIGN: false, PE: false },
});

let questionSeq = 0;

const hasChoices = (type: QuestionType) => type === 'SINGLE' || type === 'MULTIPLE';

const createBlankChoices = () => {
  questionSeq += 1;
  return [
    { id: `choice-${questionSeq}-1`, label: '' },
    { id: `choice-${questionSeq}-2`, label: '' },
  ];
};

export const createQuestion = (type: QuestionType): ProjectQuestion => {
  questionSeq += 1;
  return {
    id: `question-${questionSeq}`,
    type,
    title: '',
    description: '',
    required: true,
    choices: hasChoices(type) ? createBlankChoices() : [],
  };
};

// 질문 유형만 바꿈. 질문·설명·필수 여부는 유지하고, 선택형으로 바뀌는데 선택지가 없으면 빈 선택지를 채움
export const changeQuestionType = (
  question: ProjectQuestion,
  type: QuestionType,
): ProjectQuestion => ({
  ...question,
  type,
  choices:
    hasChoices(type) && question.choices.length === 0 ? createBlankChoices() : question.choices,
});

export const getTotalRecruitCount = ({ designCount, peCount }: RecruitInfo) =>
  designCount + peCount;

// 모집 정보는 인원이 있고, PE를 모집하면 플랫폼까지 골라야 함
export const isRecruitComplete = (recruit: RecruitInfo) =>
  getTotalRecruitCount(recruit) > 0 && (recruit.peCount === 0 || recruit.pePlatform !== null);

// PM 선택은 운영진만 함 (PM 본인 등록은 본인으로 정해짐)
export const isBasicInfoComplete = (draft: ProjectDraft, needsPmSelect: boolean) =>
  (draft.thumbnail !== null || draft.thumbnailUrl !== '') &&
  (draft.logo !== null || draft.logoUrl !== '') &&
  draft.name.trim() !== '' &&
  draft.description.trim() !== '' &&
  draft.planUrl.trim() !== '' &&
  (!needsPmSelect || draft.pmIds.every((id) => id !== ''));

const isQuestionComplete = ({ type, title, choices }: ProjectQuestion) =>
  title.trim() !== '' &&
  ((type !== 'SINGLE' && type !== 'MULTIPLE') ||
    (choices.length > 0 && choices.every(({ label }) => label.trim() !== '')));

// 사용 중인 섹션(공통 + 켜 둔 Design · PE)의 문항이 모두 채워졌는지
export const isQuestionsComplete = (draft: ProjectDraft) => {
  const sections: QuestionSectionKey[] = [
    'COMMON',
    ...(['DESIGN', 'PE'] as const).filter((key) => draft.sectionEnabled[key]),
  ];
  return sections.every((key) => draft.questions[key].every(isQuestionComplete));
};

// 임시 저장 · 나가기 확인 대상: 아무것도 쓰지 않은 처음 상태가 아닌지
export const hasDraftContent = (draft: ProjectDraft) =>
  draft.thumbnail !== null ||
  draft.logo !== null ||
  draft.thumbnailUrl !== '' ||
  draft.logoUrl !== '' ||
  draft.name !== '' ||
  draft.description !== '' ||
  draft.planUrl !== '' ||
  draft.pmIds.some((id) => id !== '') ||
  draft.recruit.designCount > 0 ||
  draft.recruit.peCount > 0 ||
  draft.recruit.pePlatform !== null ||
  Object.values(draft.questions).some((questions) => questions.length > 0) ||
  draft.sectionEnabled.DESIGN ||
  draft.sectionEnabled.PE;
