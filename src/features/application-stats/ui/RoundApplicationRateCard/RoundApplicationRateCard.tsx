import ProgressSummaryCard from '@/shared/ui/ProgressSummaryCard/ProgressSummaryCard';
import RoundCountList from '@/shared/ui/ProgressSummaryCard/RoundCountList';
import { ROUND_DOT_CLASS } from '@/shared/ui/ProgressSummaryCard/roundShareColors';
import RoundShareDonut from '@/shared/ui/ProgressSummaryCard/RoundShareDonut';

import {
  getCurrentRoundSummary,
  getRoundApplicationStats,
} from '../../model/getRoundApplicationStats';
import type { RoundProgress } from '../../model/types';
import RoundAppliedSummary from './RoundAppliedSummary';

// PM용 매칭 차수별 지원률 카드: 차수별 지원 인원 비율 도넛 + 진행된 차수 요약 + 차수별 지원 목록
const RoundApplicationRateCard = (progress: RoundProgress) => {
  const { rate } = getCurrentRoundSummary(progress);
  // 현재 차수까지, 지원 인원이 없으면 0명 (피그마 "데이터 없음": 요약 0명, 도넛은 회색 원만)
  const openedCounts = progress.rounds
    .filter(({ round }) => round <= progress.currentRound)
    .map(({ round, applied }) => ({ round, count: applied ?? 0 }));

  return (
    <ProgressSummaryCard
      title="매칭 차수별 지원률"
      ring={
        <RoundShareDonut rate={rate} counts={openedCounts} eligibleCount={progress.eligibleCount} />
      }
      summary={<RoundAppliedSummary counts={openedCounts} />}
      details={
        <RoundCountList
          label="지원"
          rounds={getRoundApplicationStats(progress).map(({ round, applied, eligible }) => ({
            round,
            value: applied,
            max: eligible,
          }))}
          dotClassNames={ROUND_DOT_CLASS}
        />
      }
    />
  );
};

export default RoundApplicationRateCard;
