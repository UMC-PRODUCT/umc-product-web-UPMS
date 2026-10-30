import { toCount } from '@/shared/api/toId';

import type { ChapterMatchingStatisticsResponse } from '../api/getChapterMatchingStatistics';
import type {
  ChapterMatchingRate,
  MatchingPart,
  ProjectMatchings,
  RoundMatching,
  RoundMatchingKey,
  SchoolMatching,
} from './types';

type ProjectStatistic = NonNullable<
  ChapterMatchingStatisticsResponse['projectMatchingStatistics']
>[number];
type Phase = NonNullable<
  NonNullable<ChapterMatchingStatisticsResponse['roundMatchingStatistics']>[number]['phase']
>;
type ServerPart = NonNullable<NonNullable<ProjectStatistic['parts']>[number]['part']>;

const ROUND_KEY: Record<Phase, RoundMatchingKey> = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
  RANDOM_MATCHING: 'RANDOM',
};

const ROUND_KEYS: RoundMatchingKey[] = [1, 2, 3, 'RANDOM'];
const PM_ROUNDS = [1, 2, 3] as const;

// 모집 파트 (Design · PE만 모집)
const MATCHING_PART: Partial<Record<ServerPart, MatchingPart>> = {
  DESIGN: 'DESIGN',
  WEB_PRODUCT_ENGINEER: 'WEB_PE',
  MOBILE_PRODUCT_ENGINEER: 'MOBILE_PE',
};

// 차수별 매칭 인원. 서버가 지금 매칭 유형(Plan-Design 또는 Plan-PE) 하나만 골라 집계해 줌
// 생성되지 않은 차수는 응답에 없어서 Map에 없음 (인원 수가 문자열로 와서 숫자로 맞춤)
const toRoundTotals = ({ roundMatchingStatistics = [] }: ChapterMatchingStatisticsResponse) =>
  new Map(
    roundMatchingStatistics.flatMap(({ phase, matchedMemberCount }) =>
      phase ? [[ROUND_KEY[phase], toCount(matchedMemberCount)] as const] : [],
    ),
  );

// 차수별 매칭 현황 카드 (1 · 2 · 3차 · 랜덤). 아직 생성 전인 차수는 null
export const toRoundMatchings = (
  statistics: ChapterMatchingStatisticsResponse,
): RoundMatching[] => {
  const totals = toRoundTotals(statistics);
  return ROUND_KEYS.map((round) => ({ round, matched: totals.get(round) ?? null }));
};

// 지부 프로젝트 정원(TO) 합: 프로젝트별 Design · PE 정원을 더함
const getTotalCapacity = ({ projectMatchingStatistics = [] }: ChapterMatchingStatisticsResponse) =>
  projectMatchingStatistics.reduce(
    (sum, { parts = [] }) =>
      sum +
      parts.reduce(
        (partSum, { part, quota }) => partSum + (part && MATCHING_PART[part] ? toCount(quota) : 0),
        0,
      ),
    0,
  );

// 지부 프로젝트 매칭률 카드: 1 · 2 · 3차 매칭 인원 / 차수별 남은 정원(이전 차수 매칭 인원을 뺀 정원)
export const toChapterMatchingRate = (
  statistics: ChapterMatchingStatisticsResponse,
): ChapterMatchingRate => {
  const totals = toRoundTotals(statistics);
  const totalCapacity = getTotalCapacity(statistics);
  let matchedBefore = 0;
  const rounds = PM_ROUNDS.map((round) => {
    const matched = totals.get(round) ?? null;
    const capacity = matched === null ? null : totalCapacity - matchedBefore;
    matchedBefore += matched ?? 0;
    return { round, matched, capacity };
  });
  return { totalCapacity, rounds };
};

// 학교별 매칭 현황 카드 (학교 이름을 모르면 뺌)
export const toSchoolMatchings = ({
  schoolMatchingStatistics = [],
}: ChapterMatchingStatisticsResponse): SchoolMatching[] =>
  schoolMatchingStatistics.flatMap(({ schoolName, matchedMemberCount, totalMemberCount }) =>
    schoolName
      ? [{ schoolName, matched: toCount(matchedMemberCount), total: toCount(totalMemberCount) }]
      : [],
  );

// 프로젝트별 매칭 현황 차트: 차수별 매칭 인원 + 툴팁의 파트별 매칭 인원 / 정원 (모집하는 파트만)
export const toProjectMatchings = ({
  projectMatchingStatistics = [],
}: ChapterMatchingStatisticsResponse): ProjectMatchings[] =>
  projectMatchingStatistics.map(({ projectName, rounds = [], parts = [] }) => {
    const countOf = (phase: Phase) =>
      toCount(rounds.find((round) => round.phase === phase)?.matchedMemberCount);
    return {
      projectName: projectName ?? '',
      counts: { 1: countOf('FIRST'), 2: countOf('SECOND'), 3: countOf('THIRD') },
      parts: parts.flatMap(({ part, matchedMemberCount, quota }) => {
        const matchingPart = part && MATCHING_PART[part];
        return matchingPart
          ? [{ part: matchingPart, matched: toCount(matchedMemberCount), capacity: toCount(quota) }]
          : [];
      }),
    };
  });
