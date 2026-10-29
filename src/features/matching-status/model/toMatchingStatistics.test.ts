import type { ProjectsResponse } from '@/entities/project';

import type { ChapterMatchingStatisticsResponse } from '../api/getChapterMatchingStatistics';
import type { ProjectMembers } from '../hooks/useProjectsMembers';
import {
  getTotalCapacity,
  toChapterMatchingRate,
  toProjectMatchings,
  toRoundMatchings,
  toSchoolMatchings,
} from './toMatchingStatistics';

type ProjectSummary = NonNullable<ProjectsResponse['content']>[number];

const round = (type: string, phase: string) => ({ matchingRoundId: '1', type, phase });

// 서버는 ID · 인원 수를 문자열로 줌. 1차는 Design · PE 차수가 따로 옴
const statistics = {
  chapterId: '46',
  roundMatchingStatistics: [
    {
      matchingRound: round('PLAN_DESIGN', 'FIRST'),
      matchedMemberCount: '3',
      projects: [{ projectId: '3', matchedMemberCount: '2' }],
    },
    {
      matchingRound: round('PLAN_DEVELOPER', 'FIRST'),
      matchedMemberCount: '5',
      projects: [
        { projectId: '3', matchedMemberCount: '1' },
        { projectId: '4', matchedMemberCount: '4' },
      ],
    },
    {
      matchingRound: round('PLAN_DESIGN', 'SECOND'),
      matchedMemberCount: '2',
      projects: [{ projectId: '4', matchedMemberCount: '2' }],
    },
  ],
  schoolMatchingStatistics: [
    { schoolId: '2', matchedMemberCount: '6', totalMemberCount: '20' },
    { schoolId: '999', matchedMemberCount: '1', totalMemberCount: '1' },
  ],
} as unknown as ChapterMatchingStatisticsResponse;

const projects = [
  {
    id: '3',
    name: 'UMC Web',
    partQuotas: [
      { part: 'PLAN', quota: '1' },
      { part: 'DESIGN', quota: '2' },
      { part: 'WEB_PRODUCT_ENGINEER', quota: '4' },
    ],
  },
  {
    id: '4',
    name: '모아모아',
    partQuotas: [
      { part: 'DESIGN', quota: '2' },
      { part: 'MOBILE_PRODUCT_ENGINEER', quota: '4' },
    ],
  },
] as unknown as ProjectSummary[];

describe('toRoundMatchings', () => {
  it('같은 차수의 Design · PE 매칭 인원을 합치고, 진행 전 차수는 null', () => {
    expect(toRoundMatchings(statistics)).toEqual([
      { round: 1, matched: 8 },
      { round: 2, matched: 2 },
      { round: 3, matched: null },
      { round: 'RANDOM', matched: null },
    ]);
  });
});

describe('toChapterMatchingRate', () => {
  it('차수별 남은 정원은 이전 차수 매칭 인원을 뺀 정원', () => {
    const totalCapacity = getTotalCapacity(projects);
    expect(totalCapacity).toBe(12); // PM 정원은 빼고 Design · PE만
    expect(toChapterMatchingRate(statistics, totalCapacity)).toEqual({
      totalCapacity: 12,
      rounds: [
        { round: 1, matched: 8, capacity: 12 },
        { round: 2, matched: 2, capacity: 4 },
        { round: 3, matched: null, capacity: null },
      ],
    });
  });
});

describe('toSchoolMatchings', () => {
  it('학교 이름을 붙이고 이름을 모르는 학교는 뺀다', () => {
    expect(toSchoolMatchings(statistics, [{ id: 2, name: '가톨릭대학교' }])).toEqual([
      { schoolName: '가톨릭대학교', matched: 6, total: 20 },
    ]);
  });
});

describe('toProjectMatchings', () => {
  it('프로젝트별 차수 매칭 인원과 파트별 매칭 인원 / 정원', () => {
    const members = new Map([
      [
        3,
        {
          partGroups: [
            { part: 'DESIGN', members: [{ memberId: '10' }, { memberId: '11' }] },
            { part: 'WEB_PRODUCT_ENGINEER', members: [{ memberId: '12' }] },
          ],
        } as unknown as ProjectMembers,
      ],
    ]);

    expect(toProjectMatchings(statistics, projects, members)).toEqual([
      {
        projectName: 'UMC Web',
        counts: { 1: 3, 2: 0, 3: 0 },
        parts: [
          { part: 'DESIGN', matched: 2, capacity: 2 },
          { part: 'WEB_PE', matched: 1, capacity: 4 },
        ],
      },
      {
        projectName: '모아모아',
        counts: { 1: 4, 2: 2, 3: 0 },
        parts: [
          { part: 'DESIGN', matched: 0, capacity: 2 },
          { part: 'MOBILE_PE', matched: 0, capacity: 4 },
        ],
      },
    ]);
  });
});
