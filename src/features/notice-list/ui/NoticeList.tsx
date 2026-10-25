import { ChevronLeftIcon } from '@umc-product/icons';
import { Button, Divider, Pagination } from '@umc-product/react';
import { Fragment, type ReactNode, useState } from 'react';

import { type Notice, NoticeCard, sortNotices } from '@/entities/notice';

import NoticeItem from './NoticeItem';

const PAGE_SIZE = 10;

type NoticeListProps = {
  notices: Notice[];
  // 넘기면 펼친 공지 아래에 수정·삭제 버튼이 나타난다 (권한이 있는 운영진)
  onEdit?: (notice: Notice) => void;
  onDelete?: (notice: Notice) => void;
  // 수정 중인 공지는 목록 안에서 편집 화면으로 바뀌고, 카드 맨 위에 돌아가기 버튼이 붙는다
  editingId?: string | null;
  renderEditor?: (notice: Notice) => ReactNode;
  onCancelEdit?: () => void;
};

// 공지 목록 카드 + 페이지네이션. 필독 우선·최신순으로 정렬해 10개씩 보여주고, 한 번에 하나만 펼친다.
const NoticeList = ({
  notices,
  onEdit,
  onDelete,
  editingId = null,
  renderEditor,
  onCancelEdit,
}: NoticeListProps) => {
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const sorted = sortNotices(notices);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  // 삭제 등으로 마지막 페이지가 사라져도 빈 페이지가 보이지 않게 한다
  const currentPage = Math.min(page, totalPages);
  const pageNotices = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  // 펼쳐 둔 공지가 삭제되는 등 현재 목록에 없으면 선택된 공지가 없는 것으로 본다 (다른 항목이 흐려지지 않게)
  const activeId = pageNotices.some((notice) => notice.id === openId) ? openId : null;
  const isEditing = editingId !== null && pageNotices.some((notice) => notice.id === editingId);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    setOpenId(null);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <NoticeCard className="min-h-[560px] pb-6">
        {isEditing && (
          <div className="px-4 pt-5">
            <Button
              variant="weak"
              color="white"
              size="sm"
              leadingIcon={<ChevronLeftIcon size={14} />}
              onClick={onCancelEdit}
            >
              돌아가기
            </Button>
          </div>
        )}
        <ul className="flex flex-col gap-px">
          {pageNotices.map((notice, index) => (
            <Fragment key={notice.id}>
              {notice.id === editingId && renderEditor ? (
                <li>
                  {index > 0 && <Divider className="mx-8" />}
                  {renderEditor(notice)}
                </li>
              ) : (
                <NoticeItem
                  notice={notice}
                  open={activeId === notice.id}
                  weak={activeId !== null && activeId !== notice.id}
                  showDivider={index > 0}
                  onToggle={() => setOpenId(activeId === notice.id ? null : notice.id)}
                  onEdit={onEdit && (() => onEdit(notice))}
                  onDelete={onDelete && (() => onDelete(notice))}
                />
              )}
            </Fragment>
          ))}
        </ul>
      </NoticeCard>
      <Pagination totalPages={totalPages} page={currentPage} onPageChange={handlePageChange} />
    </div>
  );
};

export default NoticeList;
