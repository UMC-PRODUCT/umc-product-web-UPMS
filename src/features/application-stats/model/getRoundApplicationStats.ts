import type { RoundApplicationStat, RoundProgress } from './types';

// N차 지원 가능 인원 = 전체 지원 가능 인원 - (1 ~ N-1차 매칭 인원)
// 이전 차수 중 매칭이 끝나지 않은 차수가 있으면 아직 산정할 수 없으므로 null
export const getRoundApplicationStats = ({
  eligibleCount,
  rounds,
}: Pick<RoundProgress, 'eligibleCount' | 'rounds'>): RoundApplicationStat[] =>
  rounds.map(({ round, applied }, index) => {
    const previousMatched = rounds.slice(0, index).map(({ matched }) => matched);
    const eligible = previousMatched.includes(null)
      ? null
      : previousMatched.reduce<number>((rest, matched) => rest - (matched ?? 0), eligibleCount);

    return { round, applied, eligible };
  });

// 현재 차수의 지원 완료 / 지원 전 인원
export const getCurrentRoundSummary = (progress: RoundProgress) => {
  const current = getRoundApplicationStats(progress).find(
    ({ round }) => round === progress.currentRound,
  );
  const eligible = current?.eligible ?? 0;
  const appliedCount = current?.applied ?? 0;

  return {
    appliedCount,
    notAppliedCount: Math.max(0, eligible - appliedCount),
    rate: eligible === 0 ? 0 : Math.round((appliedCount / eligible) * 100),
  };
};
