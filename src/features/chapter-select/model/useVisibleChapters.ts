import { MOCK_CHAPTERS } from '@/entities/chapter';
import { getChapterScope, useSessionStore } from '@/entities/session';

// 권한에 따라 지부 선택에 보여줄 지부 목록
export const useVisibleChapters = () => {
  const { role, chapterId } = useSessionStore((state) => state.session);

  if (getChapterScope(role) === 'ALL') return MOCK_CHAPTERS;
  return MOCK_CHAPTERS.filter((chapter) => chapter.id === chapterId);
};
