import type { ApplicationDetailResponse } from '../api/getApplicationDetail';
import type { ApplicationAnswer, ApplicationSection } from './types';

type FormResponse = NonNullable<ApplicationDetailResponse['formResponse']>;
type SectionView = NonNullable<FormResponse['sections']>[number];
type QuestionView = NonNullable<SectionView['questions']>[number];

const byOrder = (a: { orderNo?: number }, b: { orderNo?: number }) =>
  (a.orderNo ?? 0) - (b.orderNo ?? 0);

const toAnswer = ({ type, options = [], answer }: QuestionView): ApplicationAnswer => {
  switch (type) {
    case 'RADIO':
    case 'DROPDOWN':
    case 'CHECKBOX': {
      const selected = answer?.selectedOptions ?? [];
      return {
        type: 'CHOICE',
        multiple: type === 'CHECKBOX',
        options: [...options].sort(byOrder).map(({ optionId, content, isOther }) => {
          // '기타'를 고르고 직접 적은 내용이 있으면 보기 이름 대신 보여 줌
          // ID가 숫자 · 문자열 어느 쪽으로 와도 맞도록 문자열로 비교
          const other = isOther
            ? selected.find(({ questionOptionId }) => String(questionOptionId) === String(optionId))
            : undefined;
          return {
            value: String(optionId),
            label: other?.answeredAsContent || (content ?? ''),
          };
        }),
        selected: selected.map(({ questionOptionId }) => String(questionOptionId)),
      };
    }
    case 'FILE':
    case 'PORTFOLIO': {
      // TODO: 파일 여러 개 표시 (지원서 화면은 첨부 하나만 그림). 지금은 첫 파일만
      const [file] = answer?.files ?? [];
      if (file) return { type: 'ATTACHMENT', label: file.originalFileName ?? '', href: file.url };
      // 포트폴리오를 링크로 낸 경우
      if (answer?.textValue) {
        return { type: 'ATTACHMENT', label: answer.textValue, href: answer.textValue };
      }
      return { type: 'TEXT', text: '' };
    }
    case 'SCHEDULE':
      return { type: 'TEXT', text: (answer?.times ?? []).join(', ') };
    default:
      return { type: 'TEXT', text: answer?.textValue ?? '' };
  }
};

// 지원서 상세의 폼 응답 → 지원서 화면 섹션. 문항 번호는 폼 전체에서 01부터 이어 붙임
export const toApplicationSections = ({
  formResponse,
}: ApplicationDetailResponse): ApplicationSection[] => {
  let number = 0;

  return [...(formResponse?.sections ?? [])].sort(byOrder).map((section) => ({
    sectionId: String(section.sectionId),
    title: section.title || (section.type === 'COMMON' ? '공통 문항' : ''),
    questions: [...(section.questions ?? [])].sort(byOrder).map((question) => {
      number += 1;
      return {
        questionId: String(question.questionId),
        number: String(number).padStart(2, '0'),
        title: question.title ?? '',
        required: question.isRequired ?? false,
        answer: toAnswer(question),
      };
    }),
  }));
};
