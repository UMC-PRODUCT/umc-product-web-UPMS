import { createFileRoute, Navigate } from '@tanstack/react-router';

import { useNotices } from '@/entities/notice';
import { useCanManageNotice } from '@/entities/session';
import { useResolvedChapterId } from '@/features/chapter-select';
import { NoticeForm } from '@/features/notice-write';
import { TeamMatchingHeader } from '@/widgets/teamMatchingHeader';

type NoticeWriteSearch = { chapter?: string; edit?: string };

const NoticeWritePage = () => {
  const { chapter, edit } = Route.useSearch();
  const navigate = Route.useNavigate();
  const chapterId = useResolvedChapterId(chapter);
  const canManage = useCanManageNotice(chapterId);
  const notices = useNotices(chapterId);
  const editing = edit ? notices.find((notice) => notice.id === edit) : undefined;

  // 공지를 관리할 수 없는 사용자는 목록으로 돌려보낸다
  if (!canManage) {
    return <Navigate to="/demo-day/team-matching/notice" replace />;
  }

  const goToList = () =>
    navigate({ to: '/demo-day/team-matching/notice', search: { chapter: chapterId } });

  return (
    <div className="flex flex-col gap-8 pt-12 pr-52 pb-20 pl-11">
      <TeamMatchingHeader />
      <NoticeForm
        key={editing?.id ?? 'new'}
        chapterId={chapterId}
        notice={editing}
        onBack={goToList}
        onComplete={goToList}
      />
    </div>
  );
};

export const Route = createFileRoute('/demo-day/team-matching/notice/new')({
  validateSearch: (search): NoticeWriteSearch => ({
    chapter: typeof search.chapter === 'string' ? search.chapter : undefined,
    edit: typeof search.edit === 'string' ? search.edit : undefined,
  }),
  component: NoticeWritePage,
});
