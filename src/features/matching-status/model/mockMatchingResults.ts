import type {
  MatchedMember,
  PlatformMatchingResults,
  ProjectMatchingResult,
  RoundMatchingKey,
} from './types';

// TODO: 매칭 일정 API 연동. 매칭 기간 동안만 지원서 열람 · 매칭 해제 · 수동 배정 가능
// 매칭 기간이 끝나거나 최종 결과가 발표되면 어드민도 챌린저 뷰처럼 조회만 가능
export const MOCK_MATCHING_PERIOD_OPEN = true;

const member = (memberId: string, round: RoundMatchingKey): MatchedMember => ({
  memberId,
  challengerName: '닉네임/이름',
  schoolName: '한국대',
  round,
  matchedAt: '2026-10-12T18:00:00+09:00',
  submittedAt: '2026-10-01T10:00:00+09:00',
});

// Design 1명 + PE 4명 모집. peRounds는 PE 자리에 매칭된 차수 (4개보다 적으면 남은 자리는 빈 칸)
const project = (
  projectId: string,
  peLabel: 'Web' | 'Mobile',
  recruiting: boolean,
  peRounds: RoundMatchingKey[],
): ProjectMatchingResult => ({
  projectId,
  projectName: '프로젝트 명',
  pmName: '닉네임/이름',
  pmSchoolName: '한국대',
  recruiting,
  parts: [
    { part: 'DESIGN', partLabel: 'Design', capacity: 1, members: [member(`${projectId}-d`, 1)] },
    {
      part: peLabel === 'Web' ? 'WEB_PE' : 'MOBILE_PE',
      partLabel: peLabel,
      capacity: 4,
      members: peRounds.map((round, index) => member(`${projectId}-${index}`, round)),
    },
  ],
});

// TODO: 매칭 결과 API 연동 시 제거. 피그마와 같은 플랫폼별 프로젝트 4개
export const MOCK_MATCHING_RESULTS: PlatformMatchingResults[] = [
  {
    platform: 'WEB',
    projects: [
      project('web-1', 'Web', false, [1, 2, 2, 'RANDOM']),
      project('web-2', 'Web', true, [1, 2, 2]),
      project('web-3', 'Web', true, [1, 1, 2]),
      project('web-4', 'Web', false, [1, 2, 3, 'RANDOM']),
    ],
  },
  {
    platform: 'MOBILE',
    projects: [
      project('mobile-1', 'Mobile', false, [1, 2, 2, 'RANDOM']),
      project('mobile-2', 'Mobile', true, [1, 2, 2]),
      project('mobile-3', 'Mobile', true, [1, 2, 2]),
      project('mobile-4', 'Mobile', true, [1, 2, 2]),
    ],
  },
];
