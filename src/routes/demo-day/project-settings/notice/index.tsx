import { createFileRoute } from '@tanstack/react-router';

import { useProjectSettingsAccess } from '@/entities/session';
import { useResolvedChapterId } from '@/features/chapter-select';

import { NoticeListPage } from '../../-notice';

type NoticeSearch = { chapter?: string };

const ProjectSettingsNoticePage = () => {
  const { chapter } = Route.useSearch();
  const navigate = Route.useNavigate();
  const chapterId = useResolvedChapterId(chapter);
  // 지부장 이상(FULL)만 지부 선택·공지 작성을 쓴다. 교내 운영진과 PM 챌린저는 읽기 전용 목록만 본다.
  const showControl = useProjectSettingsAccess() === 'FULL';

  return (
    <NoticeListPage
      kind="PROJECT_SETTINGS"
      chapterId={chapterId}
      onChapterChange={(nextChapterId) =>
        navigate({ search: { chapter: nextChapterId }, replace: true })
      }
      showControl={showControl}
      onWrite={() =>
        navigate({ to: '/demo-day/project-settings/notice/new', search: { chapter: chapterId } })
      }
    />
  );
};

export const Route = createFileRoute('/demo-day/project-settings/notice/')({
  validateSearch: (search): NoticeSearch => ({
    chapter: typeof search.chapter === 'string' ? search.chapter : undefined,
  }),
  component: ProjectSettingsNoticePage,
});
