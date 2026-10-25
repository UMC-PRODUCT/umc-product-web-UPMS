import type { ReactNode } from 'react';

export type CountBreakdownRow = {
  label: string; // 예: 학교 이름
  value: number | null; // 해당 인원, 아직 집계 전이면 null → "- 명"
  max: number | null; // 전체 인원
};

type CountBreakdownCardProps = {
  icon: ReactNode; // 30~32px 픽토그램
  title: string; // 예: 총원, 학교별 매칭 현황
  totalCount: number;
  rows: CountBreakdownRow[];
  emptyMessage: ReactNode; // 집계된 인원이 없을 때 안내 문구
  isEmpty: boolean;
  className?: string; // 좌우 여백 등 (피그마: 지원자 32px, 매칭자 28px)
};

const formatCount = (count: number | null) => (count === null ? '- 명' : `${count}명`);

// 피그마 Count Breakdown Card: 아이콘 + "제목 N명" + 항목별 "인원 / 전체 인원" (지원 현황 총원, 전체 매칭 현황 학교별 매칭 현황)
const CountBreakdownCard = ({
  icon,
  title,
  totalCount,
  rows,
  emptyMessage,
  isEmpty,
  className = 'px-7',
}: CountBreakdownCardProps) => (
  <div
    className={`flex h-full w-full min-w-[260px] flex-col justify-between gap-8 rounded-xl border border-teal-grey-100 bg-white pt-[26px] pb-8 shadow-drop-neutral-3 ${className}`}
  >
    <p className="flex items-center gap-2.5 text-heading-3-semibold whitespace-nowrap text-teal-600">
      {icon}
      <span className="flex items-center gap-1">
        <span>{title}</span>
        <span>{totalCount}명</span>
      </span>
    </p>
    {isEmpty ? (
      <p className="flex flex-1 items-center justify-center text-center text-body-2-medium text-teal-grey-400">
        {emptyMessage}
      </p>
    ) : (
      <ul className="flex w-full flex-col gap-3">
        {rows.map(({ label, value, max }) => (
          <li key={label} className="flex w-full items-center justify-between gap-2">
            <span className="truncate text-body-1-medium text-teal-grey-600">{label}</span>
            <span className="flex shrink-0 items-center justify-end gap-1 text-right text-body-2-medium whitespace-nowrap">
              <span className="text-teal-500">{formatCount(value)}</span>
              <span className="flex items-center gap-0.5 text-teal-grey-500">
                <span>/</span>
                <span className="min-w-[38px]">{formatCount(max)}</span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default CountBreakdownCard;
