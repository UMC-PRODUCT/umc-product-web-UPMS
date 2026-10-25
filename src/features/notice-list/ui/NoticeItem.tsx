import { ExpandLessIcon, ExpandMoreIcon } from '@umc-product/icons';
import { Button, Divider } from '@umc-product/react';
import { useId } from 'react';

import { formatNoticeDate, type Notice } from '@/entities/notice';
import { cn } from '@/shared/lib/cn';

import NoticeContent from './NoticeContent';

type NoticeItemProps = {
  notice: Notice;
  open: boolean; // 선택되어 본문이 펼쳐진 상태
  weak: boolean; // 다른 공지가 선택되어 제목이 흐리게 보이는 상태
  showDivider?: boolean; // 위쪽 구분선 (첫 항목 제외)
  onToggle: () => void;
  // 수정·삭제 권한이 있을 때만 본문 아래에 버튼이 나타난다
  onEdit?: () => void;
  onDelete?: () => void;
};

// 피그마 Web/Notice/Item Header + Item Content: 제목을 누르면 본문이 아코디언으로 펼쳐진다
const NoticeItem = ({
  notice,
  open,
  weak,
  showDivider = false,
  onToggle,
  onEdit,
  onDelete,
}: NoticeItemProps) => {
  const contentId = useId();
  const Icon = open ? ExpandLessIcon : ExpandMoreIcon;
  const showActions = !notice.hardcoded && (onEdit !== undefined || onDelete !== undefined);

  return (
    <li>
      {/* 구분선은 좌우 32px 안쪽 */}
      {showDivider && <Divider className="mx-8" />}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={onToggle}
        className={cn(
          'group flex w-full cursor-pointer items-end gap-2.5 rounded-xl px-10 py-6 text-left',
          !open && 'hover:bg-teal-grey-50',
        )}
      >
        <span className="flex min-w-0 flex-1 flex-col items-start gap-2.5">
          {notice.required && (
            <span className="inline-flex h-[30px] items-center rounded-full border border-teal-300 bg-teal-75 px-3 text-label-3-medium text-teal-600">
              필독
            </span>
          )}
          <span className="flex w-full flex-col gap-2">
            <span
              className={cn(
                'truncate text-title-2-semibold',
                open && 'text-teal-600',
                weak && 'text-teal-grey-500',
                !open && !weak && 'text-teal-grey-900',
              )}
            >
              {notice.title}
            </span>
            <span className="flex flex-col gap-[3px] text-body-2-regular text-teal-grey-700">
              <span className="truncate">작성자: {notice.authorLabel}</span>
              <span className="truncate">{formatNoticeDate(notice.createdAt)}</span>
            </span>
          </span>
        </span>
        <span
          className={cn(
            'flex size-[30px] shrink-0 items-center justify-center rounded-[10px]',
            weak && 'group-hover:bg-teal-grey-50 group-hover:shadow-inner-neutral-2',
          )}
        >
          <Icon size={24} />
        </span>
      </button>
      {open && (
        <div id={contentId} className="px-8">
          <div className="flex flex-col gap-8 rounded-xl bg-teal-grey-50 px-6 py-5 shadow-inner-neutral-2">
            <NoticeContent content={notice.content} />
            {showActions && (
              <div className="flex items-center justify-end gap-2">
                {onEdit && (
                  <Button variant="weak" color="neutral" size="xs" onClick={onEdit}>
                    수정
                  </Button>
                )}
                {onDelete && (
                  <Button variant="weak" color="red" size="xs" onClick={onDelete}>
                    삭제
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  );
};

export default NoticeItem;
