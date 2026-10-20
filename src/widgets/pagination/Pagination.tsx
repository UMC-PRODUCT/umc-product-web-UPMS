import { ChevronLeftIcon, ChevronRightIcon } from '@umc-product/icons';

type PaginationProps = {
  page: number; // 현재 페이지 (1부터)
  totalPages: number;
  onPageChange: (page: number) => void;
  visibleCount?: number; // 한 번에 보여줄 페이지 번호 개수
  className?: string;
};

const ARROW_CLASS = 'flex size-[30px] items-center justify-center rounded-xl text-teal-grey-400';

// 현재 페이지가 가운데 오도록 보여줄 번호 범위를 정함
const getVisiblePages = (page: number, totalPages: number, visibleCount: number) => {
  const count = Math.min(visibleCount, totalPages);
  const start = Math.min(
    Math.max(1, page - Math.floor(count / 2)),
    Math.max(1, totalPages - count + 1),
  );
  return Array.from({ length: count }, (_, index) => start + index);
};

// 목록 화면 공용 페이지네이션
// 피그마 규칙: 첫 페이지면 [<] 없음, 마지막 페이지면 [>] 없음, 1페이지뿐이면 번호만
const Pagination = ({
  page,
  totalPages,
  onPageChange,
  visibleCount = 5,
  className = '',
}: PaginationProps) => {
  if (totalPages < 1) return null;

  return (
    <nav aria-label="페이지 이동" className={`flex items-center gap-2.5 ${className}`}>
      {page > 1 && (
        <button
          type="button"
          aria-label="이전 페이지"
          className={ARROW_CLASS}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon weight="thin" size={16} />
        </button>
      )}
      <ul className="flex items-center gap-4">
        {getVisiblePages(page, totalPages, visibleCount).map((pageNumber) => {
          const current = pageNumber === page;
          return (
            <li key={pageNumber}>
              <button
                type="button"
                aria-current={current ? 'page' : undefined}
                aria-label={`${pageNumber}페이지`}
                onClick={() => onPageChange(pageNumber)}
                className={`flex size-[30px] items-center justify-center rounded-xl text-body-3-semibold tracking-[-0.14px] text-teal-grey-800 ${
                  current ? 'bg-teal-grey-75 shadow-[inset_-1px_2.5px_4px_0_#e4e4e433]' : ''
                }`}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}
      </ul>
      {page < totalPages && (
        <button
          type="button"
          aria-label="다음 페이지"
          className={ARROW_CLASS}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRightIcon weight="thin" size={16} />
        </button>
      )}
    </nav>
  );
};

export default Pagination;
