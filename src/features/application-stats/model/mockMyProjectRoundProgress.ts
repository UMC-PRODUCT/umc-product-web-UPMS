import type { RoundProgress } from './types';

// TODO: 내 프로젝트 지원 통계 API 연동. 지금은 화면 확인용 mock
// 1차 30명 지원·12명 매칭 → 2차 지원 가능 88명 중 56명 지원(64%)
export const MOCK_MY_PROJECT_ROUND_PROGRESS: RoundProgress = {
  currentRound: 2,
  eligibleCount: 100,
  rounds: [
    { round: 1, applied: 30, matched: 12 },
    { round: 2, applied: 56, matched: null },
    { round: 3, applied: null, matched: null },
  ],
};
