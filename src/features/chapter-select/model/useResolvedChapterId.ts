import { useSessionStore } from '@/entities/session';

import { useVisibleChapters } from './useVisibleChapters';

// 주소로 받은 지부가 볼 수 있는 지부면 그 지부, 아니면 본인 지부, 그것도 없으면 첫 지부
export const useResolvedChapterId = (requestedChapterId?: string) => {
  const chapters = useVisibleChapters();
  const sessionChapterId = useSessionStore((state) => state.session.chapterId);

  if (requestedChapterId && chapters.some((chapter) => chapter.id === requestedChapterId)) {
    return requestedChapterId;
  }
  return chapters.find((chapter) => chapter.id === sessionChapterId)?.id ?? chapters[0]?.id ?? '';
};
