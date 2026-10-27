import { create } from 'zustand';

import { getMockNotices } from './notices';
import type { Notice, NoticeInput, NoticeKind } from './types';

// TODO: 공지 API가 나오면 이 스토어를 react-query 훅으로 교체. 지금은 화면 흐름 확인용 메모리 저장소.
type NoticeState = {
  byScope: Record<string, Notice[]>; // `${kind}:${chapterId}` 별 목록
  addNotice: (
    kind: NoticeKind,
    chapterId: string,
    input: NoticeInput,
    authorLabel: string,
  ) => Notice;
  updateNotice: (kind: NoticeKind, chapterId: string, noticeId: string, input: NoticeInput) => void;
  removeNotice: (kind: NoticeKind, chapterId: string, noticeId: string) => void;
};

const scopeOf = (kind: NoticeKind, chapterId: string) => `${kind}:${chapterId}`;

// 처음 조회하는 지부는 목 데이터로 시작한다. 같은 참조를 돌려줘야 리렌더링이 반복되지 않는다.
const seedCache = new Map<string, Notice[]>();
const getSeed = (kind: NoticeKind, chapterId: string) => {
  const scope = scopeOf(kind, chapterId);
  const cached = seedCache.get(scope);
  if (cached) return cached;

  const seed = getMockNotices(kind, chapterId);
  seedCache.set(scope, seed);
  return seed;
};

const today = () => new Date().toISOString().slice(0, 10);

export const useNoticeStore = create<NoticeState>()((set, get) => {
  const read = (kind: NoticeKind, chapterId: string) =>
    get().byScope[scopeOf(kind, chapterId)] ?? getSeed(kind, chapterId);
  const write = (kind: NoticeKind, chapterId: string, next: Notice[]) =>
    set((state) => ({ byScope: { ...state.byScope, [scopeOf(kind, chapterId)]: next } }));

  return {
    byScope: {},

    addNotice: (kind, chapterId, input, authorLabel) => {
      const notice: Notice = {
        id: `${kind}-${chapterId}-${crypto.randomUUID()}`,
        kind,
        chapterId,
        createdAt: today(),
        authorLabel,
        ...input,
      };
      write(kind, chapterId, [notice, ...read(kind, chapterId)]);
      return notice;
    },

    updateNotice: (kind, chapterId, noticeId, input) => {
      write(
        kind,
        chapterId,
        read(kind, chapterId).map((notice) =>
          notice.id === noticeId ? { ...notice, ...input } : notice,
        ),
      );
    },

    removeNotice: (kind, chapterId, noticeId) => {
      write(
        kind,
        chapterId,
        read(kind, chapterId).filter((notice) => notice.id !== noticeId),
      );
    },
  };
});

export const useNotices = (kind: NoticeKind, chapterId: string) =>
  useNoticeStore((state) => state.byScope[scopeOf(kind, chapterId)] ?? getSeed(kind, chapterId));
