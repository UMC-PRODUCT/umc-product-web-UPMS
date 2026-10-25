import { createFileRoute, Navigate } from '@tanstack/react-router';

import { useCanManageNotice } from '@/entities/session';
import { useResolvedChapterId } from '@/features/chapter-select';

import { NoticeWritePage } from '../../-notice';

type NoticeWriteSearch = { chapter?: string };

const ProjectSettingsNoticeWritePage = () => {
  const { chapter } = Route.useSearch();
  const navigate = Route.useNavigate();
  const chapterId = useResolvedChapterId(chapter);
  const canManage = useCanManageNotice(chapterId);

  // 공지를 관리할 수 없는 사용자는 목록으로 돌려보낸다
  if (!canManage) {
    return <Navigate to="/demo-day/project-settings/notice" replace />;
  }

  return (
    <NoticeWritePage
      kind="PROJECT_SETTINGS"
      chapterId={chapterId}
      onComplete={(completedChapterId) =>
        navigate({
          to: '/demo-day/project-settings/notice',
          search: { chapter: completedChapterId },
        })
      }
    />
  );
};

export const Route = createFileRoute('/demo-day/project-settings/notice/new')({
  validateSearch: (search): NoticeWriteSearch => ({
    chapter: typeof search.chapter === 'string' ? search.chapter : undefined,
  }),
  component: ProjectSettingsNoticeWritePage,
});
