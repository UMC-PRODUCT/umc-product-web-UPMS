import type { SchoolSummary } from '@/entities/chapter';
import type { ProjectsResponse } from '@/entities/project';
import { toCount, toId } from '@/shared/api/toId';

import type { ChapterMatchingStatisticsResponse } from '../api/getChapterMatchingStatistics';
import type { ProjectMembers } from '../hooks/useProjectsMembers';
import type {
  ChapterMatchingRate,
  MatchingPart,
  ProjectMatchings,
  RoundMatching,
  RoundMatchingKey,
  SchoolMatching,
} from './types';

type RoundStatistic = NonNullable<
  ChapterMatchingStatisticsResponse['roundMatchingStatistics']
>[number];
type Phase = NonNullable<NonNullable<RoundStatistic['matchingRound']>['phase']>;
type ProjectSummary = NonNullable<ProjectsResponse['content']>[number];
type ServerPart = NonNullable<NonNullable<ProjectSummary['partQuotas']>[number]['part']>;

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

type RoundTotal = { matched: number; projects: Map<number, number> };

// 차수별 매칭 인원 (Plan-Design · Plan-PE 차수를 합침). 통계가 없는 차수는 Map에 없음
// "전체" 매칭 현황이라 한 트랙만 고르지 않고 같은 차수끼리 더함
const sumByRound = ({ roundMatchingStatistics = [] }: ChapterMatchingStatisticsResponse) => {
  const totals = new Map<RoundMatchingKey, RoundTotal>();
  for (const { matchingRound, matchedMemberCount, projects = [] } of roundMatchingStatistics) {
    const key = matchingRound?.phase && ROUND_KEY[matchingRound.phase];
    if (!key) continue;
    const total = totals.get(key) ?? { matched: 0, projects: new Map() };
    // 인원 수 · ID가 문자열로 와서 숫자로 맞춤
    total.matched += toCount(matchedMemberCount);
    for (const project of projects) {
      const projectId = toId(project.projectId);
      if (projectId === null) continue;
      total.projects.set(
        projectId,
        (total.projects.get(projectId) ?? 0) + toCount(project.matchedMemberCount),
      );
    }
    totals.set(key, total);
  }
  return totals;
};

// 차수별 매칭 현황 카드 (1 · 2 · 3차 · 랜덤). 아직 진행 전인 차수는 null
export const toRoundMatchings = (
  statistics: ChapterMatchingStatisticsResponse,
): RoundMatching[] => {
  const totals = sumByRound(statistics);
  return ROUND_KEYS.map((round) => ({ round, matched: totals.get(round)?.matched ?? null }));
};

// 지부 프로젝트 정원(TO) 합. 통계에 없어서 프로젝트 목록의 Design · PE 정원을 더함
export const getTotalCapacity = (projects: ProjectSummary[]) =>
  projects.reduce(
    (sum, { partQuotas = [] }) =>
      sum +
      partQuotas.reduce(
        (partSum, { part, quota }) => partSum + (part && MATCHING_PART[part] ? toCount(quota) : 0),
        0,
      ),
    0,
  );

// 지부 프로젝트 매칭률 카드: 1 · 2 · 3차 매칭 인원 / 차수별 남은 정원(이전 차수 매칭 인원을 뺀 정원)
export const toChapterMatchingRate = (
  statistics: ChapterMatchingStatisticsResponse,
  totalCapacity: number,
): ChapterMatchingRate => {
  const totals = sumByRound(statistics);
  let matchedBefore = 0;
  const rounds = PM_ROUNDS.map((round) => {
    const matched = totals.get(round)?.matched ?? null;
    const capacity = matched === null ? null : totalCapacity - matchedBefore;
    matchedBefore += matched ?? 0;
    return { round, matched, capacity };
  });
  return { totalCapacity, rounds };
};

// 학교별 매칭 현황 카드. 통계에는 학교 ID만 있어서 지부 소속 학교 이름을 붙임 (이름을 모르는 학교는 뺌)
export const toSchoolMatchings = (
  { schoolMatchingStatistics = [] }: ChapterMatchingStatisticsResponse,
  schools: SchoolSummary[],
): SchoolMatching[] =>
  schoolMatchingStatistics.flatMap(({ schoolId, matchedMemberCount, totalMemberCount }) => {
    const id = toId(schoolId);
    const schoolName = schools.find((school) => school.id === id)?.name;
    if (!schoolName) return [];
    return [{ schoolName, matched: toCount(matchedMemberCount), total: toCount(totalMemberCount) }];
  });

// 프로젝트별 매칭 현황 차트: 차수별 매칭 인원 + 툴팁의 파트별 매칭 인원 / 정원
// 이름 · 정원은 프로젝트 목록, 파트별 매칭 인원은 팀원 구성에서 가져옴 (프로젝트 목록 순서)
export const toProjectMatchings = (
  statistics: ChapterMatchingStatisticsResponse,
  projects: ProjectSummary[],
  membersByProject: ReadonlyMap<number, ProjectMembers>,
): ProjectMatchings[] => {
  const totals = sumByRound(statistics);

  return projects.flatMap(({ id, name, partQuotas = [] }) => {
    const projectId = toId(id);
    if (projectId === null) return [];
    const partGroups = membersByProject.get(projectId)?.partGroups ?? [];

    return [
      {
        projectName: name ?? '',
        counts: {
          1: totals.get(1)?.projects.get(projectId) ?? 0,
          2: totals.get(2)?.projects.get(projectId) ?? 0,
          3: totals.get(3)?.projects.get(projectId) ?? 0,
        },
        parts: partQuotas.flatMap(({ part, quota }) => {
          const matchingPart = part && MATCHING_PART[part];
          if (!matchingPart) return [];
          const members = partGroups.find((group) => group.part === part)?.members ?? [];
          return [{ part: matchingPart, matched: members.length, capacity: toCount(quota) }];
        }),
      },
    ];
  });
};
