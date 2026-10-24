import { Pagination } from '@umc-product/react';
import { type ReactNode, useState } from 'react';

import { type Notice, sortNotices } from '@/entities/notice';
import { cn } from '@/shared/lib/cn';

import NoticeItem from './NoticeItem';

const PAGE_SIZE = 10;

type NoticeListProps = {
  notices: Notice[];
  header?: ReactNode; // 목록 위에 붙는 영역 (운영진 뷰의 제목·지부 선택·공지 작성 버튼)
  className?: string;
  // 넘기면 펼친 공지 아래에 수정·삭제 버튼이 나타난다 (운영진 뷰)
  onEdit?: (notice: Notice) => void;
  onDelete?: (notice: Notice) => void;
};

// 공지 목록. 필독 우선·최신순으로 정렬해 10개씩 보여주고, 한 번에 하나만 펼친다.
const NoticeList = ({ notices, header, className, onEdit, onDelete }: NoticeListProps) => {
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const sorted = sortNotices(notices);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  // 삭제 등으로 마지막 페이지가 사라져도 빈 페이지가 보이지 않게 한다
  const currentPage = Math.min(page, totalPages);
  const pageNotices = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  // 펼쳐 둔 공지가 삭제되는 등 현재 목록에 없으면 선택된 공지가 없는 것으로 본다 (다른 항목이 흐려지지 않게)
  const activeId = pageNotices.some((notice) => notice.id === openId) ? openId : null;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    setOpenId(null);
  };

  return (
    <div className={cn('flex w-full flex-col justify-between', className)}>
      <div className="flex flex-col gap-2.5">
        {header}
        <ul className="flex flex-col">
          {pageNotices.map((notice, index) => (
            <NoticeItem
              key={notice.id}
              notice={notice}
              open={activeId === notice.id}
              weak={activeId !== null && activeId !== notice.id}
              showDivider={index > 0}
              onToggle={() => setOpenId(activeId === notice.id ? null : notice.id)}
              onEdit={onEdit && (() => onEdit(notice))}
              onDelete={onDelete && (() => onDelete(notice))}
            />
          ))}
        </ul>
      </div>
      <Pagination
        totalPages={totalPages}
        page={currentPage}
        onPageChange={handlePageChange}
        className="justify-center"
      />
    </div>
  );
};

export default NoticeList;
