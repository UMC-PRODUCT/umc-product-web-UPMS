import { Pagination } from '@umc-product/react';
import { useState } from 'react';

import { type Notice, sortNotices } from '@/entities/notice';

import NoticeItem from './NoticeItem';

const PAGE_SIZE = 10;

type NoticeListProps = {
  notices: Notice[];
};

// 공지 목록 카드. 필독 우선·최신순으로 정렬해 10개씩 보여주고, 한 번에 하나만 펼친다.
const NoticeList = ({ notices }: NoticeListProps) => {
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const sorted = sortNotices(notices);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageNotices = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    setOpenId(null);
  };

  return (
    // 피그마: 목록 영역 폭 900px (카드 왼쪽 20px, 오른쪽 48px)
    <div className="flex min-h-[779px] w-full flex-col justify-between rounded-xl border border-teal-grey-100 bg-white py-3 pr-12 pl-5 shadow-drop-neutral-3">
      <ul className="flex flex-col">
        {pageNotices.map((notice, index) => (
          <NoticeItem
            key={notice.id}
            notice={notice}
            open={openId === notice.id}
            weak={openId !== null && openId !== notice.id}
            showDivider={index > 0}
            onToggle={() => setOpenId((prev) => (prev === notice.id ? null : notice.id))}
          />
        ))}
      </ul>
      <Pagination
        totalPages={totalPages}
        page={page}
        onPageChange={handlePageChange}
        className="justify-center"
      />
    </div>
  );
};

export default NoticeList;
