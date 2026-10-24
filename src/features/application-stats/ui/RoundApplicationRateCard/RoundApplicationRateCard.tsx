import {
  getCurrentRoundSummary,
  getRoundApplicationStats,
} from '../../model/getRoundApplicationStats';
import type { RoundProgress } from '../../model/types';
import connectorLine from '../RoundProgressCard/assets/connector.svg';
import RoundApplicationList from '../RoundProgressCard/RoundApplicationList';
import RoundAppliedSummary from './RoundAppliedSummary';
import { ROUND_DOT_CLASS } from './roundShareColors';
import RoundShareDonut from './RoundShareDonut';

// PM용 매칭 차수별 지원률 카드: 차수별 지원 인원 비율 도넛 + 진행된 차수 요약 + 차수별 지원 목록
const RoundApplicationRateCard = (progress: RoundProgress) => {
  const { rate } = getCurrentRoundSummary(progress);
  // 현재 차수까지, 지원 인원이 없으면 0명 (피그마 "데이터 없음": 요약 0명, 도넛은 회색 원만)
  const openedCounts = progress.rounds
    .filter(({ round }) => round <= progress.currentRound)
    .map(({ round, applied }) => ({ round, count: applied ?? 0 }));

  return (
    <div className="flex w-full flex-col overflow-clip rounded-xl border border-teal-grey-100 bg-white px-7 pt-6 pb-7 shadow-drop-neutral-3">
      <div className="flex h-[246px] w-full flex-col items-center gap-8">
        <p className="w-full text-title-3-medium font-semibold text-teal-600">매칭 차수별 지원률</p>
        <div className="relative h-[176.2px] w-[439.6px] shrink-0">
          <div className="absolute top-0 left-0">
            <RoundShareDonut
              rate={rate}
              counts={openedCounts}
              eligibleCount={progress.eligibleCount}
            />
          </div>
          <div className="absolute top-3 left-[178.3px] h-4 w-20">
            <div className="absolute inset-[-16.67%_-3.33%_-4.4%_-0.88%]">
              <img src={connectorLine} alt="" className="block size-full max-w-none" />
            </div>
          </div>
          <div className="absolute top-0 left-[278.3px]">
            <RoundAppliedSummary counts={openedCounts} />
          </div>
          <div className="absolute top-[76.2px] left-[252.6px]">
            <RoundApplicationList
              rounds={getRoundApplicationStats(progress)}
              dotClassNames={ROUND_DOT_CLASS}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundApplicationRateCard;
