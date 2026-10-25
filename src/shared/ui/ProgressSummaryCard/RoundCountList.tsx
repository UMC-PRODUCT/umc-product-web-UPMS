import type { SummaryRound } from './roundShareColors';

export type RoundCount = {
  round: SummaryRound;
  value: number | null; // 해당 차수 인원, 아직 열리지 않은 차수는 null → "- 명"
  max: number | null; // 해당 차수 전체 인원
};

type RoundCountListProps = {
  label: string; // 예: 지원 → "1차 지원", 매칭 → "1차 매칭"
  rounds: RoundCount[];
  dotClassNames?: Record<SummaryRound, string>; // 도넛 색과 맞춘 차수별 점 (없으면 기본 teal 점)
};

const formatCount = (count: number | null) => (count === null ? '- 명' : `${count}명`);

// Progress Summary Card 아래쪽 차수별 "인원 / 전체 인원" 표 (카드 오른쪽 폭에 맞춰 늘어남)
const RoundCountList = ({ label, rounds, dotClassNames }: RoundCountListProps) => (
  <ul className="flex w-full flex-col gap-2.5 rounded-md bg-teal-grey-75 px-4 py-2.5">
    {rounds.map(({ round, value, max }) => (
      <li
        key={round}
        className="flex h-5 items-center justify-between text-body-3-medium whitespace-nowrap"
      >
        <span className="flex items-center gap-[5px]">
          <span
            aria-hidden
            className={`size-1.5 shrink-0 rounded-full ${dotClassNames?.[round] ?? 'bg-teal-300'}`}
          />
          <span className="text-teal-grey-600">
            {round}차 {label}
          </span>
        </span>
        <span className="flex items-center justify-end gap-[3px] text-right">
          <span className="min-w-[38px] text-teal-700">{formatCount(value)}</span>
          <span className="flex items-center justify-end gap-0.5 text-teal-grey-500">
            <span>/</span>
            <span className="min-w-[38px]">{formatCount(max)}</span>
          </span>
        </span>
      </li>
    ))}
  </ul>
);

export default RoundCountList;
