import type { ApplicationSection } from './types';

const PORTFOLIO = { type: 'ATTACHMENT', label: '2026 이예원 포트폴리오' } as const;

// TODO: 내 지원서 API 연동 (프로젝트별로 조회)
export const MOCK_MY_APPLICATION: ApplicationSection[] = [
  {
    sectionId: 'common',
    title: '공통 문항',
    questions: [
      {
        questionId: 'q1',
        number: 'Q1',
        title: '본인의 닉네임/이름을 적어주세요.',
        required: true,
        answer: { type: 'TEXT', text: '이방토/이예원' },
      },
      {
        questionId: 'q2',
        number: 'Q2',
        title: '합격 문자 전송을 위해 전화번호를 작성해주세요.',
        required: true,
        answer: { type: 'TEXT', text: '010-0000-0000' },
      },
      {
        questionId: 'q3',
        number: 'Q3',
        title: '소속 학교/전공을 적어주세요.',
        required: true,
        answer: { type: 'TEXT', text: '한양대 ERICA / 커뮤니케이션디자인학과' },
      },
      {
        questionId: 'q6',
        number: 'Q6',
        title: '포트폴리오를 링크 혹은 PDF 파일의 형태로 제출하세요.',
        required: true,
        answer: PORTFOLIO,
      },
      {
        questionId: 'q7',
        number: 'Q7',
        title: '대략적인 고정일정을 알려주세요.',
        required: true,
        answer: { type: 'TEXT', text: '월.수.일 알바가 있습니다.' },
      },
      {
        questionId: 'q8',
        number: 'Q8',
        title: '하고 싶은 말이나 참고 사항이 있다면 자유롭게 적어주세요.',
        required: false,
        answer: { type: 'TEXT', text: '화이팅 ~~' },
      },
    ],
  },
  {
    sectionId: 'design',
    title: 'Design',
    questions: [
      {
        questionId: 'd3',
        number: 'Q3',
        title: '사용 가능한 기술 스택을 선택하세요.',
        required: true,
        answer: {
          type: 'CHOICE',
          multiple: true,
          options: [
            { value: 'figma', label: 'Figma' },
            { value: 'illustration', label: 'illustration' },
          ],
          selected: ['figma'],
        },
      },
      {
        questionId: 'd5',
        number: 'Q5',
        title: '포트폴리오를 링크 혹은 PDF 파일의 형태로 제출하세요.',
        required: true,
        answer: PORTFOLIO,
      },
    ],
  },
];
