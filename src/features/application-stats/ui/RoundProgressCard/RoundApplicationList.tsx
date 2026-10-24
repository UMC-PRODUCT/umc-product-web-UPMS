import type { MatchingRound, RoundApplicationStat } from '../../model/types';

type RoundApplicationListProps = {
  rounds: RoundApplicationStat[];
  dotClassNames?: Record<MatchingRound, string>; // 도넛 색과 맞춘 차수별 점 (없으면 점 생략)
};

const formatCount = (count: number | null) => (count === null ? '- 명' : `${count}명`);

// 1차 / 2차 / 3차 지원: 실제 지원 인원 / 해당 차수 지원 가능 인원
const RoundApplicationList = ({ rounds, dotClassNames }: RoundApplicationListProps) => (
  <ul className="flex w-[187px] flex-col gap-2.5 rounded-md bg-teal-grey-75 px-4 py-2.5">
    {rounds.map(({ round, applied, eligible }) => (
      <li key={round} className="flex h-5 items-start justify-between">
        <span className="flex items-center gap-1">
          {dotClassNames && (
            <span
              aria-hidden
              className={`size-1.5 shrink-0 rounded-full ${dotClassNames[round]}`}
            />
          )}
          <span className="text-caption-1-regular whitespace-nowrap text-teal-grey-600">
            {round}차 지원
          </span>
        </span>
        <span className="flex items-center justify-end gap-1 text-right text-body-4-semibold font-medium">
          <span className="min-w-[35px] whitespace-nowrap text-teal-700">
            {formatCount(applied)}
          </span>
          <span className="flex items-center justify-end gap-0.5 text-teal-grey-500">
            <span>/</span>
            <span className="min-w-[35px] whitespace-nowrap">{formatCount(eligible)}</span>
          </span>
        </span>
      </li>
    ))}
  </ul>
);

export default RoundApplicationList;
