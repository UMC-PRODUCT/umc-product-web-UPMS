import { createFileRoute } from '@tanstack/react-router';
import { AddIcon, CheckCircleIcon, WarningTriangleIcon } from '@umc-product/icons';
import { Button, Dialog, PageHeader, useToast } from '@umc-product/react';
import { useState } from 'react';

import { type Notice, NoticeCard, useNotices, useNoticeStore } from '@/entities/notice';
import { useApplicationsView, useCanManageNotice } from '@/entities/session';
import { ChapterSelectHeader, useResolvedChapterId } from '@/features/chapter-select';
import { NoticeList } from '@/features/notice-list';
import { cn } from '@/shared/lib/cn';
import { FIGMA_BUTTON_MD } from '@/shared/ui/buttonStyle';
import { FIGMA_DIALOG } from '@/shared/ui/dialogStyle';
import { TeamMatchingHeader } from '@/widgets/teamMatchingHeader';

type NoticeSearch = { chapter?: string };

const BREADCRUMBS = [{ label: '팀 매칭' }, { label: '공지' }];

const NoticePage = () => {
  const { chapter } = Route.useSearch();
  const navigate = Route.useNavigate();
  const toast = useToast();
  const chapterId = useResolvedChapterId(chapter);
  const notices = useNotices(chapterId);
  const removeNotice = useNoticeStore((state) => state.removeNotice);
  const canManage = useCanManageNotice(chapterId);
  // 챌린저 뷰(PM 챌린저 포함)에는 지부 선택이 없고, 운영진 뷰에만 있다
  const isAdminView = useApplicationsView() === 'ADMIN';

  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);

  const setChapterId = (nextChapterId: string) =>
    navigate({ search: { chapter: nextChapterId }, replace: true });

  if (!isAdminView) {
    return (
      // 피그마(1440 기준): 사이드바에서 콘텐츠까지 44px, 카드 오른쪽 끝에서 화면 끝까지 208px
      <div className="flex flex-col gap-8 pt-10 pr-52 pb-20 pl-11">
        <PageHeader
          breadcrumbs={BREADCRUMBS}
          title="공지"
          description="팀 매칭에 대한 지부별 공지를 모든 챌린저에게 안내합니다."
        />
        {/* 챌린저·PM 챌린저는 지부 선택이 보이지 않고 본인 지부 공지만 본다 */}
        <NoticeCard className="py-3 pr-12 pl-5 shadow-drop-neutral-3">
          <NoticeList key={chapterId} notices={notices} className="min-h-[779px]" />
        </NoticeCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pt-12 pr-52 pb-20 pl-11">
      <TeamMatchingHeader />
      <NoticeCard className="px-[34px] py-8 shadow-drop-neutral-3">
        <NoticeList
          key={chapterId}
          notices={notices}
          className="min-h-[793px]"
          header={
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-title-2-semibold text-teal-grey-900">공지</h2>
                <p className="text-body-2-regular text-teal-grey-600">
                  팀 매칭과 관련한 지부별 공지를 관리합니다.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <ChapterSelectHeader
                  value={chapterId}
                  onValueChange={setChapterId}
                  className="flex-1"
                />
                {canManage && (
                  <Button
                    leadingIcon={<AddIcon size={16} />}
                    className={cn(FIGMA_BUTTON_MD, 'min-w-[74px]')}
                    onClick={() =>
                      navigate({
                        to: '/demo-day/team-matching/notice/new',
                        search: { chapter: chapterId },
                      })
                    }
                  >
                    공지 작성
                  </Button>
                )}
              </div>
            </div>
          }
          onEdit={
            canManage
              ? (notice) =>
                  navigate({
                    to: '/demo-day/team-matching/notice/new',
                    search: { chapter: chapterId, edit: notice.id },
                  })
              : undefined
          }
          onDelete={canManage ? setDeleteTarget : undefined}
        />
      </NoticeCard>

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        color="primary"
        className={FIGMA_DIALOG}
        icon={<WarningTriangleIcon weight="fill" />}
        title="공지 삭제"
        description={
          <>
            삭제한 공지는 되돌릴 수 없습니다.
            <br />
            삭제하시겠습니까?
          </>
        }
        confirmLabel="삭제하기"
        cancelLabel="돌아가기"
        onConfirm={() => {
          if (deleteTarget) removeNotice(chapterId, deleteTarget.id);
          setDeleteTarget(null);
          toast.show({
            message: '공지가 삭제되었습니다.',
            color: 'primary',
            icon: <CheckCircleIcon weight="fill" />,
          });
        }}
      />
    </div>
  );
};

export const Route = createFileRoute('/demo-day/team-matching/notice/')({
  validateSearch: (search): NoticeSearch => ({
    chapter: typeof search.chapter === 'string' ? search.chapter : undefined,
  }),
  component: NoticePage,
});
