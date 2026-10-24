import {
  getCurrentRoundSummary,
  getRoundApplicationStats,
} from '../../model/getRoundApplicationStats';
import type { RoundProgress } from '../../model/types';
import ApplicationRateDonut from './ApplicationRateDonut';
import ApplicationSummary from './ApplicationSummary';
import connectorLine from './assets/connector.svg';
import RoundApplicationList from './RoundApplicationList';

// N차 매칭 지원 현황 카드: 지원율 도넛 + 지원 인원 표 + 차수별 지원 카드
const RoundProgressCard = (progress: RoundProgress) => {
  const { appliedCount, notAppliedCount, rate } = getCurrentRoundSummary(progress);

  return (
    <div className="flex w-full flex-col overflow-clip rounded-xl border border-teal-grey-100 bg-white px-7 pt-6 pb-7 shadow-drop-neutral-3">
      <div className="flex h-[246px] w-full flex-col items-center gap-8">
        <p className="w-full text-title-3-medium font-semibold text-teal-600">
          {progress.currentRound}차 매칭 지원 현황
        </p>
        <div className="relative h-[176.2px] w-[439.6px] shrink-0">
          <div className="absolute top-0 left-0">
            <ApplicationRateDonut rate={rate} />
          </div>
          <div className="absolute top-3 left-[178.3px] h-4 w-20">
            <div className="absolute inset-[-16.67%_-3.33%_-4.4%_-0.88%]">
              <img src={connectorLine} alt="" className="block size-full max-w-none" />
            </div>
          </div>
          <div className="absolute top-0 left-[278.3px]">
            <ApplicationSummary appliedCount={appliedCount} notAppliedCount={notAppliedCount} />
          </div>
          <div className="absolute top-[76.2px] left-[252.6px]">
            <RoundApplicationList rounds={getRoundApplicationStats(progress)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundProgressCard;
