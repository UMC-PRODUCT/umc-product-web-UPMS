import type { ApplicationDetailResponse } from '../api/getApplicationDetail';
import { toApplicationSections } from './toApplicationSections';

const detail = {
  formResponse: {
    sections: [
      {
        sectionId: 2,
        type: 'PART',
        title: 'Design',
        orderNo: 2,
        questions: [
          {
            questionId: 21,
            type: 'PORTFOLIO',
            title: '포트폴리오',
            isRequired: true,
            orderNo: 1,
            answer: { files: [{ originalFileName: 'portfolio.pdf', url: 'https://file' }] },
          },
        ],
      },
      {
        sectionId: 1,
        type: 'COMMON',
        orderNo: 1,
        questions: [
          {
            questionId: 12,
            type: 'CHECKBOX',
            title: '가능한 요일',
            isRequired: false,
            orderNo: 2,
            options: [
              { optionId: 2, content: '화', orderNo: 2 },
              { optionId: 1, content: '월', orderNo: 1 },
              { optionId: 3, content: '기타', orderNo: 3, isOther: true },
            ],
            answer: {
              selectedOptions: [
                { questionOptionId: 1 },
                { questionOptionId: 3, answeredAsContent: '주말' },
              ],
            },
          },
          {
            questionId: 11,
            type: 'SHORT_TEXT',
            title: '닉네임/이름',
            isRequired: true,
            orderNo: 1,
            answer: { textValue: '벨라/황지원' },
          },
        ],
      },
    ],
  },
} as ApplicationDetailResponse;

describe('toApplicationSections', () => {
  it('섹션 · 문항을 순서대로 정렬하고 번호를 폼 전체에서 이어 붙인다', () => {
    const sections = toApplicationSections(detail);

    expect(sections.map(({ title }) => title)).toEqual(['공통 문항', 'Design']);
    expect(sections.flatMap(({ questions }) => questions.map(({ number }) => number))).toEqual([
      '01',
      '02',
      '03',
    ]);
  });

  it('글 · 보기 · 첨부 답변을 지원서 화면 형식으로 바꾼다', () => {
    const [common, design] = toApplicationSections(detail);

    expect(common.questions[0].answer).toEqual({ type: 'TEXT', text: '벨라/황지원' });
    expect(common.questions[1].answer).toEqual({
      type: 'CHOICE',
      multiple: true,
      options: [
        { value: '1', label: '월' },
        { value: '2', label: '화' },
        { value: '3', label: '주말' },
      ],
      selected: ['1', '3'],
    });
    expect(design.questions[0].answer).toEqual({
      type: 'ATTACHMENT',
      label: 'portfolio.pdf',
      href: 'https://file',
    });
  });
});
