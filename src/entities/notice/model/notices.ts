import type { Notice } from './types';

// TODO: 공지 목록 API가 나오면 실제 데이터로 교체
export const getMockNotices = (chapterId: string): Notice[] => [
  {
    id: `${chapterId}-matching-guide`,
    chapterId,
    title: '팀 매칭 안내 사항',
    content: [
      '**지원 방법**',
      '프로젝트 목록에서 각 프로젝트 내용 확인 및 기획안 확인 후, 지원하면 됩니다.',
      '',
      '**매칭 차수**',
      '매칭은 총 3회 (1차, 2차, 3차)까지 진행되며, 각 차수에 반드시 지원할 필요는 없습니다.',
      '이전 차수에서 합격하지 못한 팀에 TO가 남아있다면, 다음 차수에 다시 지원하셔도 무관합니다.',
      '3차까지 팀이 매칭되지 못한 경우, TO가 남아있는 팀에 랜덤 배정됩니다.',
      '',
      '**유의 사항**',
      '지원서 제출 후에는 수정 및 철회가 불가하니, 신중히 작성 후 제출바랍니다.',
      '각 차수에는 한 건의 프로젝트에만 지원 가능합니다.',
    ].join('\n'),
    createdAt: '2026-04-17',
    required: true,
  },
  {
    id: `${chapterId}-faq`,
    chapterId,
    title: '자주 질문하는 내용',
    content: '팀 매칭과 관련해 자주 들어오는 질문과 답변을 모아두었습니다.',
    createdAt: '2026-04-17',
    required: false,
  },
  // 프로덕트 팀이 직접 작성하는 공지
  {
    id: `${chapterId}-service-guide`,
    chapterId,
    title: '서비스 이용 및 문의사항, 버그 제보 안내',
    content: '서비스 이용 중 문의사항이나 버그는 문의사항 버튼을 통해 남겨주세요.',
    createdAt: '2026-04-04',
    required: false,
  },
];
