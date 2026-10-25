import type { ReactNode } from 'react';

import connectorLine from './assets/connector.svg';

type ProgressSummaryCardProps = {
  title: ReactNode;
  ring: ReactNode; // 170px 도넛
  summary: ReactNode; // 연결선 끝의 요약 (예: 지원 완료 / 지원 전)
  details: ReactNode; // 아래쪽 차수별 표
};

// 피그마 Progress Summary Card: 제목 + 왼쪽 도넛과 연결선 + 오른쪽 요약 · 차수별 표
// 카드 폭에 맞춰 오른쪽 영역만 늘어남 (지원 현황 581px, 전체 매칭 현황 473px)
const ProgressSummaryCard = ({ title, ring, summary, details }: ProgressSummaryCardProps) => (
  <div className="flex h-full w-full flex-col gap-8 overflow-clip rounded-xl border border-teal-grey-100 bg-white px-7 pt-6 pb-7 shadow-drop-neutral-3">
    <p className="text-title-3-medium font-semibold text-teal-600">{title}</p>
    <div className="flex h-[176px] items-center gap-5 pl-4">
      {/* 연결선은 늘리면 끝 점이 찌그러져서 도넛 쪽은 고정 폭, 도넛과 28px 겹침 */}
      <div className="isolate flex shrink-0 items-start">
        <div className="relative z-[2] -mr-7">{ring}</div>
        <img
          src={connectorLine}
          alt=""
          width={47.58}
          height={40}
          className="relative z-[1] block shrink-0"
        />
      </div>
      <div className="flex h-full min-w-0 flex-1 flex-col justify-between">
        <div className="px-1.5">{summary}</div>
        {details}
      </div>
    </div>
  </div>
);

export default ProgressSummaryCard;
