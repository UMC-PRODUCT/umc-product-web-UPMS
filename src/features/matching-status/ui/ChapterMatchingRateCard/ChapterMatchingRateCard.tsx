import CompletionSummary from '@/shared/ui/ProgressSummaryCard/CompletionSummary';
import ProgressSummaryCard from '@/shared/ui/ProgressSummaryCard/ProgressSummaryCard';
import RoundCountList from '@/shared/ui/ProgressSummaryCard/RoundCountList';
import { ROUND_DOT_CLASS } from '@/shared/ui/ProgressSummaryCard/roundShareColors';
import RoundShareDonut from '@/shared/ui/ProgressSummaryCard/RoundShareDonut';

import type { ChapterMatchingRate } from '../../model/types';

// 피그마 지부 프로젝트 매칭률 카드: 차수별 매칭 비율 도넛 + 매칭 완료 / 전 + 차수별 매칭 인원
// 도넛은 매칭된 만큼만 차수별 색으로 채우고, 남은 부분은 회색 트랙
const ChapterMatchingRateCard = ({ totalCapacity, rounds }: ChapterMatchingRate) => {
  const counts = rounds.map(({ round, matched }) => ({ round, count: matched ?? 0 }));
  const matchedCount = counts.reduce((sum, { count }) => sum + count, 0);
  const rate = totalCapacity === 0 ? 0 : Math.round((matchedCount / totalCapacity) * 100);

  return (
    <ProgressSummaryCard
      title="지부 프로젝트 매칭률"
      ring={
        <RoundShareDonut
          rate={rate}
          counts={counts}
          eligibleCount={totalCapacity}
          fillRest={false}
        />
      }
      summary={
        <CompletionSummary
          label="매칭"
          doneCount={matchedCount}
          remainingCount={Math.max(0, totalCapacity - matchedCount)}
        />
      }
      details={
        <RoundCountList
          label="매칭"
          rounds={rounds.map(({ round, matched, capacity }) => ({
            round,
            value: matched,
            max: capacity,
          }))}
          dotClassNames={ROUND_DOT_CLASS}
        />
      }
    />
  );
};

export default ChapterMatchingRateCard;
