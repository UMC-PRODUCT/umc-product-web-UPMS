import type { ReactNode } from 'react';

type ProgressSummaryCardProps = {
  title: ReactNode;
  ring: ReactNode; // 170px 도넛
  summary: ReactNode; // 연결선 끝의 요약 (예: 지원 완료 / 지원 전)
  details: ReactNode; // 아래쪽 차수별 표
};

// 피그마 Progress Summary Card: 제목 + 왼쪽 도넛과 연결선 + 오른쪽 요약 · 차수별 표
// 카드 폭에 맞춰 오른쪽 영역만 늘어남 (지원 현황 572px, 전체 매칭 현황 473px)
const ProgressSummaryCard = ({ title, ring, summary, details }: ProgressSummaryCardProps) => (
  <div className="flex h-full w-full flex-col gap-8 overflow-clip rounded-xl border border-teal-grey-100 bg-white px-7 pt-6 pb-7 shadow-drop-neutral-3">
    <p className="text-title-3-medium font-semibold text-teal-600">{title}</p>
    <div className="flex h-[176px] items-center gap-5 pl-4">
      {/* 피그마: 도넛 쪽과 요약 쪽이 반씩 나눠 갖고, 연결선은 도넛과 28px 겹쳐 남은 폭만큼 늘어남 */}
      <div className="isolate flex min-w-0 flex-1 items-start">
        <div className="relative z-[2] -mr-7 shrink-0">{ring}</div>
        {/* 끝 점이 찌그러지지 않도록 사선 · 점은 고정 크기, 가로선만 늘림
            피그마 인스턴스 좌표: 사선 (2.5, 28) → (24.1, 12), 점 중심은 오른쪽 끝에서 2.5px */}
        <div className="relative z-[1] min-w-0 flex-1 pr-[2.5px]">
          <svg aria-hidden className="block h-10 w-full overflow-visible text-teal-500">
            <line x1={2.5} y1={28} x2={24.1} y2={12} stroke="currentColor" />
            <line x1={24.1} y1={12} x2="100%" y2={12} stroke="currentColor" />
            <circle cx="100%" cy={12} r={2.67} fill="currentColor" />
          </svg>
        </div>
      </div>
      <div className="flex h-full min-w-0 flex-1 flex-col justify-between">
        <div className="px-1.5">{summary}</div>
        {details}
      </div>
    </div>
  </div>
);

export default ProgressSummaryCard;
