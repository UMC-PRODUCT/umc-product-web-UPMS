import type { Notice } from '../model/types';

// 필독 공지를 맨 위에 두고, 각각 최신순으로 정렬
export const sortNotices = (notices: Notice[]): Notice[] =>
  [...notices].sort((a, b) => {
    if (a.required !== b.required) return a.required ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
