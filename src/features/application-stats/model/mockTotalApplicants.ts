import type { RoundApplication, TotalApplicants } from './types';

// 1차 지원·매칭 인원과 2차 지원 인원으로 학교별 차수 데이터 생성
const createRounds = (
  firstApplied: number,
  firstMatched: number,
  secondApplied: number,
): RoundApplication[] => [
  { round: 1, applied: firstApplied, matched: firstMatched },
  { round: 2, applied: secondApplied, matched: null },
  { round: 3, applied: null, matched: null },
];

// TODO: 지원 통계 API 연동. 지금은 화면 확인용 mock (2차 진행 중)
export const MOCK_TOTAL_APPLICANTS: TotalApplicants = {
  currentRound: 2,
  schools: [
    { schoolName: '가톨릭대학교', eligibleCount: 30, rounds: createRounds(10, 6, 18) },
    { schoolName: '덕성여자대학교', eligibleCount: 20, rounds: createRounds(8, 4, 12) },
    { schoolName: '세종대학교', eligibleCount: 20, rounds: createRounds(5, 2, 15) },
    { schoolName: '안양대학교', eligibleCount: 10, rounds: createRounds(3, 1, 7) },
    { schoolName: '홍익대학교 서울캠퍼스', eligibleCount: 20, rounds: createRounds(9, 5, 12) },
  ],
};

// TODO: 내 프로젝트 지원 통계 API 연동. PM 화면용 mock
export const MOCK_MY_PROJECT_TOTAL_APPLICANTS: TotalApplicants = {
  currentRound: 2,
  schools: [
    { schoolName: '가톨릭대학교', eligibleCount: 30, rounds: createRounds(4, 2, 6) },
    { schoolName: '덕성여자대학교', eligibleCount: 20, rounds: createRounds(3, 1, 5) },
    { schoolName: '세종대학교', eligibleCount: 20, rounds: createRounds(2, 1, 4) },
    { schoolName: '안양대학교', eligibleCount: 10, rounds: createRounds(1, 0, 2) },
    { schoolName: '홍익대학교 서울캠퍼스', eligibleCount: 20, rounds: createRounds(3, 2, 3) },
  ],
};
