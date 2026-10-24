import type { RoundProgress } from './types';

// TODO: 지원 통계 API 연동. 지금은 화면 확인용 mock
// 400명 중 1차 30명 지원·매칭 → 2차 지원 가능 370명, 2차 진행 중
export const MOCK_ROUND_PROGRESS: RoundProgress = {
  currentRound: 2,
  eligibleCount: 400,
  rounds: [
    { round: 1, applied: 30, matched: 30 },
    { round: 2, applied: 237, matched: null },
    { round: 3, applied: null, matched: null },
  ],
};
