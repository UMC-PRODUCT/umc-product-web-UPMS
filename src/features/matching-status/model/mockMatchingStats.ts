import type { ChapterMatchingRate, ProjectMatchings, RoundMatching } from './types';

// TODO: 매칭 현황 API 연동 시 제거. 2차 매칭 진행 중인 상태
export const MOCK_CHAPTER_MATCHING_RATE: ChapterMatchingRate = {
  totalCapacity: 56,
  rounds: [
    { round: 1, matched: 22, capacity: 56 },
    { round: 2, matched: 14, capacity: 34 },
    { round: 3, matched: null, capacity: null },
  ],
};

// TODO: 매칭 현황 API 연동 시 제거. 2차 매칭 진행 중인 상태
export const MOCK_ROUND_MATCHINGS: RoundMatching[] = [
  { round: 1, matched: 22 },
  { round: 2, matched: 14 },
  { round: 3, matched: null },
  { round: 'RANDOM', matched: null },
];

// Design 1명 + PE 4명 모집 (Web, Mobile 번갈아)
const project = (
  projectName: string,
  counts: ProjectMatchings['counts'],
  design: number,
  pe: number,
  platform: 'WEB_PE' | 'MOBILE_PE',
): ProjectMatchings => ({
  projectName,
  counts,
  parts: [
    { part: 'DESIGN', matched: design, capacity: 1 },
    { part: platform, matched: pe, capacity: 4 },
  ],
});

// TODO: 매칭 현황 API 연동 시 제거
export const MOCK_PROJECT_MATCHINGS: ProjectMatchings[] = [
  project('UMC', { 1: 3, 2: 1, 3: 0 }, 1, 3, 'WEB_PE'),
  project('유엠씨', { 1: 2, 2: 2, 3: 0 }, 1, 3, 'MOBILE_PE'),
  project('토마토맛', { 1: 4, 2: 1, 3: 0 }, 1, 4, 'WEB_PE'),
  project('습관기록', { 1: 1, 2: 2, 3: 0 }, 0, 3, 'MOBILE_PE'),
  project('숨쉬기', { 1: 2, 2: 0, 3: 0 }, 1, 1, 'WEB_PE'),
  project('밥먹기', { 1: 3, 2: 1, 3: 0 }, 1, 3, 'MOBILE_PE'),
  project('수면기록', { 1: 1, 2: 1, 3: 0 }, 0, 2, 'WEB_PE'),
  project('블루베리', { 1: 2, 2: 3, 3: 0 }, 1, 4, 'MOBILE_PE'),
  project('토마토', { 1: 1, 2: 0, 3: 0 }, 0, 1, 'WEB_PE'),
  project('바나나맛', { 1: 2, 2: 1, 3: 0 }, 1, 2, 'MOBILE_PE'),
  project('쉬운 금융', { 1: 1, 2: 2, 3: 0 }, 1, 2, 'WEB_PE'),
];
