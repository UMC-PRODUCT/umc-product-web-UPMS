import { toCount } from '@/shared/api/toId';

import type { ApplicationStatisticsResponse } from '../api/getApplicationStatistics';
import type {
  MatchingRound,
  ProjectApplications,
  RoundApplication,
  RoundProgress,
  TotalApplicants,
} from './types';

type Summary = NonNullable<ApplicationStatisticsResponse['summary']>;
type RoundStatistic = NonNullable<Summary['roundApplicationStatistics']>[number];
type RoundBrief = NonNullable<RoundStatistic['matchingRound']>;
type PhaseCount = NonNullable<
  NonNullable<Summary['projectRoundStatistics']>[number]['rounds']
>[number];

// 서버 매칭 종류 (Plan-Design · Plan-PE)
export type MatchingRoundType = NonNullable<RoundBrief['type']>;

// 지원 통계는 1~3차만 (랜덤 매칭은 지원서 없이 배정)
const ROUND: Partial<Record<NonNullable<RoundBrief['phase']>, MatchingRound>> = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
};

const ROUNDS: MatchingRound[] = [1, 2, 3];

// 차수별 지원자 수 (서버는 phase로 줌, 인원 수는 문자열)
const countByRound = (rounds: PhaseCount[] = []) => {
  const counts = new Map<MatchingRound, number>();
  for (const { phase, applicantCount } of rounds) {
    const round = phase && ROUND[phase];
    if (round) counts.set(round, toCount(applicantCount));
  }
  return counts;
};

// 서버가 알려 주는 지금 매칭 종류 · 차수. 진행 중인 차수가 없으면 null (화면에서 일정으로 정함)
// 랜덤 매칭 기간은 지원이 끝난 뒤라 3차로 봄
export const getCurrentRound = ({
  matchingRound,
}: ApplicationStatisticsResponse): { type: MatchingRoundType; round: MatchingRound } | null => {
  if (!matchingRound?.type || !matchingRound.phase) return null;
  return { type: matchingRound.type, round: ROUND[matchingRound.phase] ?? 3 };
};

// 지원 통계 → N차 매칭 지원 현황 카드
// 서버는 차수별 지원 가능 인원(이전 차수 매칭 인원을 뺀 값)을 바로 줌
// 카드 계산(getRoundApplicationStats)에 맞춰 1차 지원 가능 인원 + 차수별 매칭 인원(= 이번 차수 - 다음 차수 지원 가능 인원)으로 바꿈
export const toRoundProgress = (
  { summary }: ApplicationStatisticsResponse,
  type: MatchingRoundType,
  currentRound: MatchingRound,
): RoundProgress => {
  const byRound = new Map<MatchingRound, RoundStatistic>();
  for (const statistic of summary?.roundApplicationStatistics ?? []) {
    const { type: roundType, phase } = statistic.matchingRound ?? {};
    const round = roundType === type && phase ? ROUND[phase] : undefined;
    if (round) byRound.set(round, statistic);
  }

  // 인원 수가 문자열로 와서 숫자로 맞춤. 아직 열리지 않은 차수는 통계가 없어 undefined
  const available = (round: MatchingRound) => {
    const statistic = byRound.get(round);
    return statistic && toCount(statistic.availableMemberCount);
  };
  const rounds: RoundApplication[] = ROUNDS.map((round) => {
    const statistic = byRound.get(round);
    const current = available(round);
    const next = round < 3 ? available((round + 1) as MatchingRound) : undefined;
    return {
      round,
      // 아직 열리지 않은 차수는 "- 명"
      applied: statistic ? toCount(statistic.appliedMemberCount) : null,
      // 다음 차수 지원 가능 인원이 나와야 이번 차수 매칭 인원을 알 수 있음
      matched: current !== undefined && next !== undefined ? Math.max(0, current - next) : null,
    };
  });

  return { currentRound, eligibleCount: available(1) ?? 0, rounds };
};

// 지원 통계 → 프로젝트별 지원 현황 차트 (프로젝트 이름은 응답에 있음)
export const toProjectApplications = ({
  summary,
}: ApplicationStatisticsResponse): ProjectApplications[] =>
  (summary?.projectRoundStatistics ?? []).map(({ projectName, rounds }) => {
    const counts = countByRound(rounds);
    return {
      projectName: projectName ?? '',
      counts: { 1: counts.get(1) ?? 0, 2: counts.get(2) ?? 0, 3: counts.get(3) ?? 0 },
    };
  });

// 지원 통계 → 총원 카드 (학교별 "현재 차수 지원 인원 / 지원 가능 인원")
// 학교별 차수 매칭 인원은 응답에 없어서 2차부터의 학교별 지원 가능 인원은 "- 명"으로 보임
// TODO: 백엔드에 학교별 차수 지원 가능 인원(또는 매칭 인원) 추가 요청
export const toTotalApplicants = (
  { summary }: ApplicationStatisticsResponse,
  currentRound: MatchingRound,
): TotalApplicants => ({
  currentRound,
  schools: (summary?.schoolApplicationStatistics ?? []).map(
    ({ schoolName, totalMemberCount, rounds }) => {
      const counts = countByRound(rounds);
      return {
        schoolName: schoolName ?? '',
        eligibleCount: toCount(totalMemberCount),
        rounds: ROUNDS.map((round) => ({
          round,
          applied: counts.get(round) ?? null,
          matched: null,
        })),
      };
    },
  ),
});
