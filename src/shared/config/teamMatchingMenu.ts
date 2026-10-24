export type TeamMatchingMenuItem = { label: string; href: string };

// 사이드바 '팀 매칭' 하위 메뉴와 운영진 화면 상단 탭이 같이 쓴다
export const TEAM_MATCHING_MENU: TeamMatchingMenuItem[] = [
  { label: '공지', href: '/demo-day/team-matching/notice' },
  { label: '프로젝트 목록', href: '/demo-day/team-matching/projects' },
  { label: '지원 현황', href: '/demo-day/team-matching/applications' },
  { label: '전체 매칭 현황', href: '/demo-day/team-matching/status' },
];
