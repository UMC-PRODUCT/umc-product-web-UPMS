import type { ChapterMatchingStatisticsResponse } from '../api/getChapterMatchingStatistics';
import {
  toChapterMatchingRate,
  toProjectMatchings,
  toRoundMatchings,
  toSchoolMatchings,
} from './toMatchingStatistics';

// 서버는 ID · 인원 수를 문자열로 줌. 지금 매칭 유형 하나의 생성된 차수만 옴 (3차 · 랜덤은 아직 없음)
const statistics = {
  chapterId: '46',
  roundMatchingStatistics: [
    { phase: 'FIRST', matchedMemberCount: '8', availableMemberCount: '30' },
    { phase: 'SECOND', matchedMemberCount: '2', availableMemberCount: '22' },
  ],
  schoolMatchingStatistics: [
    { schoolId: '2', schoolName: '가톨릭대학교', matchedMemberCount: '6', totalMemberCount: '20' },
    { schoolId: '999', matchedMemberCount: '1', totalMemberCount: '1' },
  ],
  projectMatchingStatistics: [
    {
      projectId: '3',
      projectName: 'UMC Web',
      matchedMemberCount: '4',
      quota: '7',
      rounds: [
        { phase: 'FIRST', matchedMemberCount: '4' },
        { phase: 'SECOND', matchedMemberCount: '0' },
      ],
      parts: [
        { part: 'PLAN', matchedMemberCount: '1', quota: '1' },
        { part: 'DESIGN', matchedMemberCount: '2', quota: '2' },
        { part: 'WEB_PRODUCT_ENGINEER', matchedMemberCount: '1', quota: '4' },
      ],
    },
    {
      projectId: '4',
      projectName: '모아모아',
      matchedMemberCount: '6',
      quota: '6',
      rounds: [
        { phase: 'FIRST', matchedMemberCount: '4' },
        { phase: 'SECOND', matchedMemberCount: '2' },
      ],
      parts: [
        { part: 'DESIGN', matchedMemberCount: '2', quota: '2' },
        { part: 'MOBILE_PRODUCT_ENGINEER', matchedMemberCount: '4', quota: '4' },
      ],
    },
  ],
} as unknown as ChapterMatchingStatisticsResponse;

describe('toRoundMatchings', () => {
  it('차수별 매칭 인원이고, 생성되지 않은 차수는 null', () => {
    expect(toRoundMatchings(statistics)).toEqual([
      { round: 1, matched: 8 },
      { round: 2, matched: 2 },
      { round: 3, matched: null },
      { round: 'RANDOM', matched: null },
    ]);
  });
});

describe('toChapterMatchingRate', () => {
  it('정원은 Design · PE만 더하고, 차수별 남은 정원은 이전 차수 매칭 인원을 뺀 정원', () => {
    expect(toChapterMatchingRate(statistics)).toEqual({
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
  it('학교 이름이 없는 학교는 뺀다', () => {
    expect(toSchoolMatchings(statistics)).toEqual([
      { schoolName: '가톨릭대학교', matched: 6, total: 20 },
    ]);
  });
});

describe('toProjectMatchings', () => {
  it('프로젝트별 차수 매칭 인원과 모집 파트별 매칭 인원 / 정원', () => {
    expect(toProjectMatchings(statistics)).toEqual([
      {
        projectName: 'UMC Web',
        counts: { 1: 4, 2: 0, 3: 0 },
        parts: [
          { part: 'DESIGN', matched: 2, capacity: 2 },
          { part: 'WEB_PE', matched: 1, capacity: 4 },
        ],
      },
      {
        projectName: '모아모아',
        counts: { 1: 4, 2: 2, 3: 0 },
        parts: [
          { part: 'DESIGN', matched: 2, capacity: 2 },
          { part: 'MOBILE_PE', matched: 4, capacity: 4 },
        ],
      },
    ]);
  });
});
