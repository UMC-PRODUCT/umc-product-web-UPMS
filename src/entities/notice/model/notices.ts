import type { Notice, NoticeKind } from './types';

const PRODUCT_AUTHOR = 'UMC PRODUCT';

// 지부 운영진이 작성한 것처럼 보이는 첫 공지 예시
const SAMPLE_CONTENT = [
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
].join('\n');

const CHAPTER_NOTICE_TITLE: Record<NoticeKind, string> = {
  TEAM_MATCHING: '팀 매칭 안내 사항',
  PROJECT_SETTINGS: '프로젝트 등록 안내사항',
};

// 피그마: 메뉴마다 하드코딩된 공지 문구가 조금 다르다
const HARDCODED_TITLES: Record<NoticeKind, [string, string]> = {
  TEAM_MATCHING: ['자주 질문하는 내용', '서비스 이용 및 문의사항, 버그제보안내'],
  PROJECT_SETTINGS: ['자주 질문하는 내용', '서비스 이용 및 문의사항, 버그 제보 안내'],
};

// TODO: 공지 목록 API가 나오면 실제 데이터로 교체
export const getMockNotices = (kind: NoticeKind, chapterId: string): Notice[] => {
  const idPrefix = `${kind}-${chapterId}`;
  const [faqTitle, guideTitle] = HARDCODED_TITLES[kind];

  return [
    {
      id: `${idPrefix}-chapter`,
      kind,
      chapterId,
      title: CHAPTER_NOTICE_TITLE[kind],
      content: SAMPLE_CONTENT,
      createdAt: '2026-04-17',
      required: true,
      authorLabel: '지부장 윰씨/김유앤',
    },
    {
      id: `${idPrefix}-faq`,
      kind,
      chapterId,
      title: faqTitle,
      content: '자주 들어오는 질문과 답변을 모아두었습니다.',
      createdAt: '2026-04-17',
      required: false,
      authorLabel: PRODUCT_AUTHOR,
      hardcoded: true,
    },
    {
      id: `${idPrefix}-service-guide`,
      kind,
      chapterId,
      title: guideTitle,
      content: '서비스 이용 중 문의사항이나 버그는 문의사항 버튼을 통해 남겨주세요.',
      createdAt: '2026-04-04',
      required: false,
      authorLabel: PRODUCT_AUTHOR,
      hardcoded: true,
    },
  ];
};
