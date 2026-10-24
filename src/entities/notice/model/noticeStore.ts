import { create } from 'zustand';

import { getMockNotices } from './notices';
import type { Notice, NoticeInput } from './types';

// TODO: 공지 API가 나오면 이 스토어를 react-query 훅으로 교체. 지금은 화면 흐름 확인용 메모리 저장소.
type NoticeState = {
  byChapter: Record<string, Notice[]>;
  addNotice: (chapterId: string, input: NoticeInput) => Notice;
  updateNotice: (chapterId: string, noticeId: string, input: NoticeInput) => void;
  removeNotice: (chapterId: string, noticeId: string) => void;
};

// 처음 조회하는 지부는 목 데이터로 시작한다. 같은 참조를 돌려줘야 리렌더링이 반복되지 않는다.
const seedCache = new Map<string, Notice[]>();
const getSeed = (chapterId: string) => {
  const cached = seedCache.get(chapterId);
  if (cached) return cached;

  const seed = getMockNotices(chapterId);
  seedCache.set(chapterId, seed);
  return seed;
};

const today = () => new Date().toISOString().slice(0, 10);

export const useNoticeStore = create<NoticeState>()((set, get) => ({
  byChapter: {},

  addNotice: (chapterId, input) => {
    const notice: Notice = {
      id: `${chapterId}-${crypto.randomUUID()}`,
      chapterId,
      createdAt: today(),
      ...input,
    };
    const current = get().byChapter[chapterId] ?? getSeed(chapterId);
    set((state) => ({ byChapter: { ...state.byChapter, [chapterId]: [notice, ...current] } }));
    return notice;
  },

  updateNotice: (chapterId, noticeId, input) => {
    const current = get().byChapter[chapterId] ?? getSeed(chapterId);
    const next = current.map((notice) =>
      notice.id === noticeId ? { ...notice, ...input } : notice,
    );
    set((state) => ({ byChapter: { ...state.byChapter, [chapterId]: next } }));
  },

  removeNotice: (chapterId, noticeId) => {
    const current = get().byChapter[chapterId] ?? getSeed(chapterId);
    const next = current.filter((notice) => notice.id !== noticeId);
    set((state) => ({ byChapter: { ...state.byChapter, [chapterId]: next } }));
  },
}));

export const useNotices = (chapterId: string) =>
  useNoticeStore((state) => state.byChapter[chapterId] ?? getSeed(chapterId));
