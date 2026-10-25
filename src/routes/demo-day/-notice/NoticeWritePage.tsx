import { PageHeader } from '@umc-product/react';

import { NOTICE_TITLE_MAX_LENGTH, type NoticeKind, useNoticeStore } from '@/entities/notice';
import { useSessionStore } from '@/entities/session';
import { useVisibleChapters } from '@/features/chapter-select';
import { NoticeWriteForm } from '@/features/notice-write';
import { useAppToast } from '@/widgets/toast';

import { getNoticeAuthorLabel } from './author';
import { NOTICE_PAGE_CONFIG, NOTICE_PAGE_LAYOUT_CLASS } from './config';

type NoticeWritePageProps = {
  kind: NoticeKind;
  chapterId: string; // 처음 선택되어 있는 지부
  onComplete: (chapterId: string) => void; // 등록한 뒤 목록으로
};

// 팀 매칭·프로젝트 설정 공지 작성. 총괄단 이상은 여러 지부에 한 번에 등록하고, 지부장은 본인 지부가 정해져 있다.
const NoticeWritePage = ({ kind, chapterId, onComplete }: NoticeWritePageProps) => {
  const config = NOTICE_PAGE_CONFIG[kind];
  const toast = useAppToast();
  const chapters = useVisibleChapters();
  const role = useSessionStore((state) => state.session.role);
  const addNotice = useNoticeStore((state) => state.addNotice);

  return (
    <div className={NOTICE_PAGE_LAYOUT_CLASS}>
      <PageHeader
        breadcrumbs={config.breadcrumbs}
        title="공지 작성"
        description={config.writeDescription}
      />
      <NoticeWriteForm
        chapters={chapters}
        initialChapterIds={[chapterId]}
        onTitleExceed={() =>
          toast.show(`제목은 ${NOTICE_TITLE_MAX_LENGTH}자까지 작성할 수 있어요`, { color: 'error' })
        }
        onSubmit={(input, chapterIds) => {
          chapterIds.forEach((id) => {
            const chapterName = chapters.find((chapter) => chapter.id === id)?.name ?? '';
            addNotice(kind, id, input, getNoticeAuthorLabel(role, chapterName));
          });
          toast.show('공지가 등록되었어요', { color: 'neutral' });
          onComplete(chapterIds[0] ?? chapterId);
        }}
      />
    </div>
  );
};

export default NoticeWritePage;
