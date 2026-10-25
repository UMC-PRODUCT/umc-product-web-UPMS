import type { MatchingRound } from '../../model/types';

type RoundAppliedSummaryProps = {
  counts: { round: MatchingRound; count: number }[];
};

// 연결선 끝의 "1차 nn명 / 2차 nn명" 요약
const RoundAppliedSummary = ({ counts }: RoundAppliedSummaryProps) => (
  <dl className="flex w-[105px] flex-col gap-0.5">
    {counts.map(({ round, count }) => (
      <div key={round} className="flex w-[82px] items-center justify-between">
        <dt className="text-body-2-semibold text-teal-grey-800">{round}차</dt>
        <dd className="flex items-center gap-px whitespace-nowrap text-teal-700">
          <span className="text-body-1-semibold">{count}</span>
          <span className="text-body-1-medium">명</span>
        </dd>
      </div>
    ))}
  </dl>
);

export default RoundAppliedSummary;
