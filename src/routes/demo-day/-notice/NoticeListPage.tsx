import { AddIcon } from '@umc-product/icons';
import { Button, PageHeader } from '@umc-product/react';
import { useState } from 'react';

import {
  type Notice,
  NOTICE_TITLE_MAX_LENGTH,
  type NoticeKind,
  useNotices,
  useNoticeStore,
} from '@/entities/notice';
import { useCanManageNotice } from '@/entities/session';
import { ChapterSelectHeader } from '@/features/chapter-select';
import { NoticeList } from '@/features/notice-list';
import { NoticeEditForm } from '@/features/notice-write';
import { DeleteNoticeDialog } from '@/widgets/dialog';
import { useAppToast } from '@/widgets/toast';

import { NOTICE_PAGE_CONFIG, NOTICE_PAGE_LAYOUT_CLASS } from './config';

type NoticeListPageProps = {
  kind: NoticeKind;
  chapterId: string;
  onChapterChange: (chapterId: string) => void;
  showControl: boolean; // 지부 선택 + 공지 작성 버튼 영역 (읽기 전용 화면에서는 숨김)
  onWrite: () => void;
};

// 팀 매칭·프로젝트 설정 공지 목록. 권한이 있으면 지부 선택·공지 작성·수정·삭제가 붙는다.
const NoticeListPage = ({
  kind,
  chapterId,
  onChapterChange,
  showControl,
  onWrite,
}: NoticeListPageProps) => {
  const config = NOTICE_PAGE_CONFIG[kind];
  const toast = useAppToast();
  const notices = useNotices(kind, chapterId);
  const updateNotice = useNoticeStore((state) => state.updateNotice);
  const removeNotice = useNoticeStore((state) => state.removeNotice);
  const canManage = useCanManageNotice(chapterId);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);

  const handleTitleExceed = () =>
    toast.show(`제목은 ${NOTICE_TITLE_MAX_LENGTH}자까지 작성할 수 있어요`, { color: 'error' });

  return (
    <div className={NOTICE_PAGE_LAYOUT_CLASS}>
      <PageHeader breadcrumbs={config.breadcrumbs} title="공지" description={config.description} />
      <div className="flex flex-col gap-6">
        {showControl && (
          <div className="flex items-center gap-2">
            <ChapterSelectHeader
              value={chapterId}
              onValueChange={(nextChapterId) => {
                setEditingId(null);
                onChapterChange(nextChapterId);
              }}
              className="flex-1"
            />
            {canManage && (
              <Button
                size="sm"
                leadingIcon={<AddIcon size={14} />}
                // 피그마: 지부 선택 줄 높이(46px)에 맞춰 늘어나고, 여백은 왼쪽 12 · 아이콘 간격 8 · 오른쪽 16
                className="gap-2 pr-4 pl-3 [--umc-button-height:46px]"
                onClick={onWrite}
              >
                공지 작성
              </Button>
            )}
          </div>
        )}
        <NoticeList
          key={`${kind}-${chapterId}`}
          notices={notices}
          onEdit={canManage ? (notice) => setEditingId(notice.id) : undefined}
          onDelete={canManage ? setDeleteTarget : undefined}
          editingId={editingId}
          onCancelEdit={() => setEditingId(null)}
          renderEditor={(notice) => (
            <NoticeEditForm
              notice={notice}
              onTitleExceed={handleTitleExceed}
              onSubmit={(input) => {
                updateNotice(kind, chapterId, notice.id, input);
                setEditingId(null);
                toast.show('공지가 수정되었어요', { color: 'neutral' });
              }}
            />
          )}
        />
      </div>

      <DeleteNoticeDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) removeNotice(kind, chapterId, deleteTarget.id);
          setDeleteTarget(null);
          toast.showBottom('공지가 삭제되었어요', { color: 'neutral' });
        }}
      />
    </div>
  );
};

export default NoticeListPage;
