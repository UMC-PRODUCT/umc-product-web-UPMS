import type { RoundMatchingKey } from '../../model/types';

// 피그마 Upms Tag/Numeric: 차수별 색 (랜덤은 회색 R)
const ROUND_TAG: Record<RoundMatchingKey, { text: string; className: string }> = {
  1: { text: '1', className: 'bg-teal-600 text-white' },
  2: { text: '2', className: 'bg-teal-400 text-white' },
  3: { text: '3', className: 'bg-teal-200 text-teal-600' },
  RANDOM: { text: 'R', className: 'bg-teal-grey-200 text-teal-grey-600' },
};

// 매칭된 차수를 나타내는 14px 숫자 태그
const MatchingRoundTag = ({ round }: { round: RoundMatchingKey }) => {
  const { text, className } = ROUND_TAG[round];

  return (
    <span
      aria-hidden
      className={`flex size-3.5 shrink-0 items-center justify-center rounded text-[11px] leading-[1.3] font-medium ${className}`}
    >
      {text}
    </span>
  );
};

export default MatchingRoundTag;
