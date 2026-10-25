import CompletionSummary from '@/shared/ui/ProgressSummaryCard/CompletionSummary';
import ProgressSummaryCard from '@/shared/ui/ProgressSummaryCard/ProgressSummaryCard';
import RoundCountList from '@/shared/ui/ProgressSummaryCard/RoundCountList';

import {
  getCurrentRoundSummary,
  getRoundApplicationStats,
} from '../../model/getRoundApplicationStats';
import type { RoundProgress } from '../../model/types';
import ApplicationRateDonut from './ApplicationRateDonut';

// N차 매칭 지원 현황 카드: 지원율 도넛 + 지원 인원 표 + 차수별 지원 카드
const RoundProgressCard = (progress: RoundProgress) => {
  const { appliedCount, notAppliedCount, rate } = getCurrentRoundSummary(progress);

  return (
    <ProgressSummaryCard
      title={`${progress.currentRound}차 매칭 지원 현황`}
      ring={<ApplicationRateDonut rate={rate} />}
      summary={
        <CompletionSummary label="지원" doneCount={appliedCount} remainingCount={notAppliedCount} />
      }
      details={
        <RoundCountList
          label="지원"
          rounds={getRoundApplicationStats(progress).map(({ round, applied, eligible }) => ({
            round,
            value: applied,
            max: eligible,
          }))}
        />
      }
    />
  );
};

export default RoundProgressCard;
