import type { NoticeKind } from '@/entities/notice';

type NoticePageConfig = {
  breadcrumbs: { label: string; href?: string }[];
  description: string; // 목록 화면 설명
  writeDescription: string; // 작성 화면 설명
};

// 피그마: 각 메뉴별 공지 페이지의 Description이 다르다
export const NOTICE_PAGE_CONFIG: Record<NoticeKind, NoticePageConfig> = {
  TEAM_MATCHING: {
    breadcrumbs: [
      { label: '데모데이 매칭', href: '/demo-day' },
      { label: '팀 매칭' },
      { label: '공지' },
    ],
    description: '모든 챌린저에게 지부별 팀 매칭을 안내해요.',
    writeDescription: '모든 챌린저에게 안내 할 공지를 작성해요',
  },
  PROJECT_SETTINGS: {
    breadcrumbs: [
      { label: '데모데이 매칭', href: '/demo-day' },
      { label: '프로젝트 설정' },
      { label: '공지' },
    ],
    description: '지부별 운영진과 PM 챌린저에게 프로젝트 설정을 안내해요.',
    writeDescription: 'PM 챌린저나 운영진에게 안내 할 공지를 작성해요',
  },
};

// 피그마 Web/Page Header 위치: 사이드바에서 32px, 오른쪽은 화면 끝에서 128px 떨어진 폭 1062px 영역
export const NOTICE_PAGE_LAYOUT_CLASS = 'flex flex-col gap-8 pt-12 pr-32 pb-20 pl-8';
