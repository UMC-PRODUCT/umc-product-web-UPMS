import { ExpandLessIcon, ExpandMoreIcon } from '@umc-product/icons';
import { Button, Divider, Tag } from '@umc-product/react';
import { useId } from 'react';

import type { Notice } from '@/entities/notice';
import { cn } from '@/shared/lib/cn';
import { FIGMA_BUTTON_MD } from '@/shared/ui/buttonStyle';

import NoticeContent from './NoticeContent';

type NoticeItemProps = {
  notice: Notice;
  open: boolean; // 선택되어 본문이 펼쳐진 상태
  weak: boolean; // 다른 공지가 선택되어 흐리게 보이는 상태
  showDivider?: boolean; // 위쪽 구분선 (첫 항목 제외)
  onToggle: () => void;
  // 운영진 뷰에서만 본문 아래에 수정·삭제 버튼이 나타난다
  onEdit?: () => void;
  onDelete?: () => void;
};

// 제목을 누르면 본문이 아코디언으로 펼쳐지는 공지 목록 항목
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
  const showActions = onEdit !== undefined || onDelete !== undefined;

  return (
    // 펼쳐진 공지와 아래 목록 사이 간격 16px
    <li className={cn(open && 'mb-4')}>
      {/* 피그마: 구분선은 좌우 12px 안쪽 */}
      {showDivider && <Divider className="mx-3" />}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={onToggle}
        // 피그마: 필독 칩이 있는 항목은 위 패딩 16px, 나머지는 28px
        className={cn(
          'flex w-full cursor-pointer items-end gap-2.5 rounded-xl px-4 pb-7 text-left',
          notice.required ? 'pt-4' : 'pt-7',
        )}
      >
        <span className="flex min-w-0 flex-1 flex-col items-start gap-2.5">
          {notice.required && <Tag size="sm">필독</Tag>}
          <span className="flex w-full flex-col gap-2">
            <span
              className={cn(
                'truncate text-title-2-semibold',
                open && 'text-teal-600',
                weak && 'text-teal-grey-400',
                !open && !weak && 'text-teal-grey-900',
              )}
            >
              {notice.title}
            </span>
            <span
              className={cn(
                'truncate text-body-3-medium',
                weak ? 'text-teal-grey-400' : 'text-teal-grey-500',
              )}
            >
              작성 일자: {notice.createdAt.replaceAll('-', '.')}
            </span>
          </span>
        </span>
        <Icon size={30} className="shrink-0 text-teal-grey-900" />
      </button>
      {open && (
        <div
          id={contentId}
          className="flex flex-col gap-8 rounded-xl bg-teal-grey-50 px-8 pt-6 pb-[30px] shadow-inner-neutral-2"
        >
          <NoticeContent content={notice.content} />
          {showActions && (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="weak"
                color="neutral"
                className={cn(FIGMA_BUTTON_MD, 'min-w-[76px]')}
                onClick={onDelete}
              >
                삭제
              </Button>
              <Button
                variant="weak"
                color="primary"
                className={cn(FIGMA_BUTTON_MD, 'min-w-[76px]')}
                onClick={onEdit}
              >
                수정
              </Button>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default NoticeItem;
