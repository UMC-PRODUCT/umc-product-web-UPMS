import { NOTICE_CONTENTS } from './noticeContents';
import type { Notice, NoticeKind } from './types';

const PRODUCT_AUTHOR = 'UMC PRODUCT';

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
  const contents = NOTICE_CONTENTS[kind];

  return [
    {
      id: `${idPrefix}-chapter`,
      kind,
      chapterId,
      title: CHAPTER_NOTICE_TITLE[kind],
      content: contents.guide,
      createdAt: '2026-04-17',
      required: true,
      authorLabel: PRODUCT_AUTHOR,
    },
    {
      id: `${idPrefix}-faq`,
      kind,
      chapterId,
      title: faqTitle,
      content: contents.faq,
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
      content: contents.serviceGuide,
      createdAt: '2026-04-04',
      required: false,
      authorLabel: PRODUCT_AUTHOR,
      hardcoded: true,
    },
  ];
};
