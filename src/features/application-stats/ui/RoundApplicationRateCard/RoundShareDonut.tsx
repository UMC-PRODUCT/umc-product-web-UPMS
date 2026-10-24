import { useId } from 'react';

import type { MatchingRound } from '../../model/types';
import { ROUND_SEGMENT_FILL } from './roundShareColors';

// 도넛 그래프 크기 (피그마 기준)
const SIZE = 170.4;
const CENTER = SIZE / 2;
const TRACK_RADIUS = 75.6;
const TRACK_STROKE = 8.85;
const OUTER_RADIUS = 85.2;
const INNER_RADIUS = 56.7;

const pointAt = (radius: number, angle: number) => {
  const radian = ((angle - 90) * Math.PI) / 180;
  return `${CENTER + radius * Math.cos(radian)} ${CENTER + radius * Math.sin(radian)}`;
};

// start ~ end 각도(12시 기준 시계 방향)의 도넛 조각
const getSegmentPath = (start: number, end: number) => {
  const to = Math.min(end, start + 359.99); // 한 조각이 100%면 원이 닫히지 않게 살짝 덜 그림
  const largeArc = to - start > 180 ? 1 : 0;

  return [
    `M ${pointAt(OUTER_RADIUS, start)}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArc} 1 ${pointAt(OUTER_RADIUS, to)}`,
    `L ${pointAt(INNER_RADIUS, to)}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 0 ${pointAt(INNER_RADIUS, start)}`,
    'Z',
  ].join(' ');
};

type RoundShareDonutProps = {
  rate: number; // 가운데 표시할 지원율 (0 ~ 100)
  counts: { round: MatchingRound; count: number }[]; // 차수별 지원 인원
  eligibleCount: number; // 1차 기준 전체 지원 가능 인원 (원 한 바퀴)
};

// 매칭 차수별 지원률 도넛
// 차수별 조각 = 그 차수 지원 인원 ÷ 전체 지원 가능 인원, 이어 붙이고 나머지는 3차 색으로 채움
// 지원자가 없으면 회색 원만 (피그마 "데이터 없음")
const RoundShareDonut = ({ rate, counts, eligibleCount }: RoundShareDonutProps) => {
  const gradientId = useId();
  const total = counts.reduce((sum, { count }) => sum + count, 0);
  // 각 조각이 끝나는 각도 (한 바퀴를 넘지 않게 자름)
  const ends = counts.map((_, index) => {
    const sum = counts.slice(0, index + 1).reduce((acc, { count }) => acc + count, 0);
    return eligibleCount === 0 ? 0 : Math.min((sum / eligibleCount) * 360, 360);
  });
  const filledAngle = ends.at(-1) ?? 0;
  const segments = [
    ...counts.map(({ round }, index) => ({
      key: String(round),
      round,
      start: index === 0 ? 0 : ends[index - 1],
      end: ends[index],
    })),
    // 나머지
    ...(total > 0
      ? [{ key: 'rest', round: 3 as MatchingRound, start: filledAngle, end: 360 }]
      : []),
  ];

  return (
    <div className="relative flex size-[170.4px] items-center justify-center">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute inset-0"
        aria-hidden
      >
        <defs>
          {[true, false].map((fromBottom) => (
            <linearGradient
              key={String(fromBottom)}
              id={`${gradientId}-${fromBottom ? 'up' : 'down'}`}
              x1={CENTER}
              y1={fromBottom ? SIZE : 0}
              x2={CENTER}
              y2={fromBottom ? 0 : SIZE}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#5BFFF3" stopOpacity={0.3} />
              <stop offset={0.519231} stopColor="#4CEAD7" />
              <stop offset={0.850962} stopColor="#1DE8D0" />
            </linearGradient>
          ))}
        </defs>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={TRACK_RADIUS - TRACK_STROKE / 2}
          fill="none"
          strokeWidth={TRACK_STROKE}
          className="stroke-teal-grey-100"
        />
        {segments.map(({ key, round, start, end }) => {
          if (end <= start) return null;
          const fill = ROUND_SEGMENT_FILL[round];
          const path = getSegmentPath(start, end);
          return (
            <g key={key}>
              <path d={path} fill={fill.base} />
              <path
                d={path}
                fill={`url(#${gradientId}-${fill.gradientFromBottom ? 'up' : 'down'})`}
                fillOpacity={fill.gradientOpacity}
              />
            </g>
          );
        })}
      </svg>
      <p className="relative flex items-center gap-[1.2px] pl-[2.4px] font-semibold whitespace-nowrap text-teal-700">
        <span className="text-[31.2px] leading-[1.3]">{rate}</span>
        <span className="text-[24px] leading-[1.4] tracking-[-0.24px]">%</span>
      </p>
    </div>
  );
};

export default RoundShareDonut;
