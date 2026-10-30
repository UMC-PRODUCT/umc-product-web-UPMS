import CompletionSummary from '@/shared/ui/ProgressSummaryCard/CompletionSummary';
import ProgressSummaryCard from '@/shared/ui/ProgressSummaryCard/ProgressSummaryCard';
import RoundCountList from '@/shared/ui/ProgressSummaryCard/RoundCountList';
import type { SummaryRound } from '@/shared/ui/ProgressSummaryCard/roundShareColors';
import RoundShareDonut from '@/shared/ui/ProgressSummaryCard/RoundShareDonut';

import {
  getCurrentRoundSummary,
  getRoundApplicationStats,
} from '../../model/getRoundApplicationStats';
import type { RoundProgress } from '../../model/types';

// 피그마 N차 매칭 지원 현황 카드의 차수 점 색 (디자인 토큰에 같은 색이 없어 피그마 값 사용)
const ROUND_DOT_CLASS: Record<SummaryRound, string> = {
  1: '[--umc-dot-badge-color:#7AC7C1]',
  2: '[--umc-dot-badge-color:#8BE2DB]',
  3: '[--umc-dot-badge-color:#C0FAF3]',
};

type RoundProgressCardProps = RoundProgress & {
  title?: string; // 없으면 "N차 매칭 지원 현황" (어드민). PM은 "매칭 차수별 지원률"
};

// N차 매칭 지원 현황 카드 (어드민 · PM 공용): 차수별 지원 비율 도넛 + 지원 인원 표 + 차수별 지원 카드
// 피그마: 채운 부분 전체 = 가운데 지원율, 그 안을 차수별 지원 인원 비율로 나눠 색칠. 남은 부분은 회색 트랙
const RoundProgressCard = ({ title, ...progress }: RoundProgressCardProps) => {
  const { appliedCount, notAppliedCount, rate } = getCurrentRoundSummary(progress);
  // 현재 차수까지, 지원 인원이 없으면 0명 (도넛은 회색 원만)
  const openedCounts = progress.rounds
    .filter(({ round }) => round <= progress.currentRound)
    .map(({ round, applied }) => ({ round, count: applied ?? 0 }));
  const totalApplied = openedCounts.reduce((sum, { count }) => sum + count, 0);
  // 한 바퀴를 100으로 두고 차수별 조각 크기를 지원율 안에서 나눔
  const rateShares = openedCounts.map(({ round, count }) => ({
    round,
    count: totalApplied === 0 ? 0 : (count / totalApplied) * rate,
  }));

  return (
    <ProgressSummaryCard
      title={title ?? `${progress.currentRound}차 매칭 지원 현황`}
      ring={
        <RoundShareDonut rate={rate} counts={rateShares} eligibleCount={100} fillRest={false} />
      }
      summary={
        <CompletionSummary label="지원" doneCount={appliedCount} remainingCount={notAppliedCount} />
      }
      details={
        <RoundCountList
          label="지원"
          // 피그마 데이터 없음(1차 진행 중): 아직 열리지 않은 차수는 표에서 뺌
          rounds={getRoundApplicationStats(progress)
            .filter(({ round }) => round <= progress.currentRound)
            .map(({ round, applied, eligible }) => ({ round, value: applied, max: eligible }))}
          dotClassNames={ROUND_DOT_CLASS}
        />
      }
    />
  );
};

export default RoundProgressCard;
