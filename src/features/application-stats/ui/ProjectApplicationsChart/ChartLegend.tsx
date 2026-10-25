import { ROUND_BG_CLASS, ROUNDS } from './roundColors';

// 1차 / 2차 / 3차 지원 범례
const ChartLegend = () => (
  <ul className="flex items-center gap-2">
    {ROUNDS.map((round) => (
      <li key={round} className="flex w-[61px] items-center gap-1">
        <span aria-hidden className={`size-2 shrink-0 rounded-full ${ROUND_BG_CLASS[round]}`} />
        <span className="text-caption-2-medium whitespace-nowrap text-teal-grey-700">
          {round}차 지원
        </span>
      </li>
    ))}
  </ul>
);

export default ChartLegend;
