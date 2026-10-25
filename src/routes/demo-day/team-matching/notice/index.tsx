import { createFileRoute } from '@tanstack/react-router';

import { useApplicationsView } from '@/entities/session';
import { useResolvedChapterId } from '@/features/chapter-select';

import { NoticeListPage } from '../../-notice';

type NoticeSearch = { chapter?: string };

const TeamMatchingNoticePage = () => {
  const { chapter } = Route.useSearch();
  const navigate = Route.useNavigate();
  const chapterId = useResolvedChapterId(chapter);
  // 챌린저 뷰(PM 챌린저 포함)에는 지부 선택과 공지 작성이 없고, 운영진 뷰에만 있다
  const showControl = useApplicationsView() === 'ADMIN';

  return (
    <NoticeListPage
      kind="TEAM_MATCHING"
      chapterId={chapterId}
      onChapterChange={(nextChapterId) =>
        navigate({ search: { chapter: nextChapterId }, replace: true })
      }
      showControl={showControl}
      onWrite={() =>
        navigate({ to: '/demo-day/team-matching/notice/new', search: { chapter: chapterId } })
      }
    />
  );
};

export const Route = createFileRoute('/demo-day/team-matching/notice/')({
  validateSearch: (search): NoticeSearch => ({
    chapter: typeof search.chapter === 'string' ? search.chapter : undefined,
  }),
  component: TeamMatchingNoticePage,
});
