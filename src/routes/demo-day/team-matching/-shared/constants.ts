// 팀 매칭 페이지(지원 현황 · 전체 매칭 현황)가 같이 쓰는 값

export const getBreadcrumbs = (current: string) => [
  { label: '데모데이 매칭', href: '/demo-day' },
  { label: '팀 매칭', href: '/demo-day/team-matching/notice' },
  { label: current },
];

// TODO: 기준 시각 API 연동
export const UPDATED_AT_CAPTION = '26.00.00 00:00 기준';
