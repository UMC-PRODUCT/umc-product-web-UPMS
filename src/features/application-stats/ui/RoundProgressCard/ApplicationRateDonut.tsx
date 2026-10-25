import { useId } from 'react';

// 도넛 그래프 크기 (피그마 기준)
const SIZE = 170.4;
const CENTER = SIZE / 2;
const TRACK_RADIUS = 75.6;
const TRACK_STROKE = 8.85;
const ARC_OUTER_RADIUS = 85.2;
const ARC_INNER_RADIUS = 56.6;
const ARC_CORNER_RADIUS = 4.8;

const pointAt = (radius: number, angle: number) => {
  const radian = ((angle - 90) * Math.PI) / 180;
  return `${CENTER + radius * Math.cos(radian)} ${CENTER + radius * Math.sin(radian)}`;
};

// 12시 방향부터 시계 방향으로 rate% 만큼의 두꺼운 호.
// 모서리를 둥글게 하려고 모서리 반경만큼 안쪽으로 줄인 영역을 같은 색 선으로 둘러 그림
const getArcPath = (rate: number) => {
  const outer = ARC_OUTER_RADIUS - ARC_CORNER_RADIUS;
  const inner = ARC_INNER_RADIUS + ARC_CORNER_RADIUS;
  const middle = (outer + inner) / 2;
  const inset = (ARC_CORNER_RADIUS / middle) * (180 / Math.PI);
  const start = inset;
  const end = Math.max(start, (Math.min(rate, 99.9) / 100) * 360 - inset);
  const largeArc = end - start > 180 ? 1 : 0;

  return [
    `M ${pointAt(outer, start)}`,
    `A ${outer} ${outer} 0 ${largeArc} 1 ${pointAt(outer, end)}`,
    `L ${pointAt(inner, end)}`,
    `A ${inner} ${inner} 0 ${largeArc} 0 ${pointAt(inner, start)}`,
    'Z',
  ].join(' ');
};

type ApplicationRateDonutProps = {
  rate: number; // 0 ~ 100
};

// 지원율 도넛: 회색 트랙 위에 지원율만큼 그라데이션 호
const ApplicationRateDonut = ({ rate }: ApplicationRateDonutProps) => {
  const gradientId = useId();
  const arcPath = getArcPath(rate);

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
          {/* 피그마 호 색상: #81D3C9 위에 그라데이션 30% */}
          <linearGradient
            id={gradientId}
            x1={CENTER}
            y1={SIZE}
            x2={CENTER}
            y2={0}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5BFFF3" stopOpacity={0.3} />
            <stop offset={0.519231} stopColor="#4CEAD7" />
            <stop offset={0.850962} stopColor="#1DE8D0" />
          </linearGradient>
        </defs>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={TRACK_RADIUS - TRACK_STROKE / 2}
          fill="none"
          strokeWidth={TRACK_STROKE}
          className="stroke-teal-grey-100"
        />
        {rate > 0 && (
          <g strokeWidth={ARC_CORNER_RADIUS * 2} strokeLinejoin="round">
            <path d={arcPath} fill="#81D3C9" stroke="#81D3C9" />
            <path
              d={arcPath}
              fill={`url(#${gradientId})`}
              stroke={`url(#${gradientId})`}
              opacity={0.3}
            />
          </g>
        )}
      </svg>
      <p className="relative flex items-center gap-[1.2px] pl-[2.4px] font-semibold whitespace-nowrap text-teal-700">
        <span className="text-[31.2px] leading-[1.3]">{rate}</span>
        <span className="text-[24px] leading-[1.4] tracking-[-0.24px]">%</span>
      </p>
    </div>
  );
};

export default ApplicationRateDonut;
