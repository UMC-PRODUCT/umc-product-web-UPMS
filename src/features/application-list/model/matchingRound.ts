import type { Applicant } from './types';

// TODO: 매칭 차수 API 연동. 지금은 3차 매칭 기간이고 1 · 2차는 끝난 상태로 확인
const MOCK_OPEN_ROUND: Applicant['round'] | null = 3;

// 해당 차수의 매칭 기간 안이면 배정 상태를 바꿀 수 있음. 끝난 차수는 결과가 확정돼 바꿀 수 없음
export const isMatchingRoundOpen = (round: Applicant['round']) => round === MOCK_OPEN_ROUND;
