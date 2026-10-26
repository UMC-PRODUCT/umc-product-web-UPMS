import { createFileRoute, Navigate } from '@tanstack/react-router';

import { useCanManageNotice } from '@/entities/session';
import { useResolvedChapterId } from '@/features/chapter-select';

import { NoticeWritePage } from '../../-notice';

type NoticeWriteSearch = { chapter?: string };

const TeamMatchingNoticeWritePage = () => {
  const { chapter } = Route.useSearch();
  const navigate = Route.useNavigate();
  const chapterId = useResolvedChapterId(chapter);
  const canManage = useCanManageNotice(chapterId);

  // 공지를 관리할 수 없는 사용자는 목록으로 돌려보낸다
  if (!canManage) {
    return <Navigate to="/demo-day/team-matching/notice" replace />;
  }

  return (
    <NoticeWritePage
      kind="TEAM_MATCHING"
      chapterId={chapterId}
      onComplete={(completedChapterId) =>
        navigate({
          to: '/demo-day/team-matching/notice',
          search: { chapter: completedChapterId },
        })
      }
    />
  );
};

export const Route = createFileRoute('/demo-day/team-matching/notice/new')({
  validateSearch: (search): NoticeWriteSearch => ({
    chapter: typeof search.chapter === 'string' ? search.chapter : undefined,
  }),
  component: TeamMatchingNoticeWritePage,
});
