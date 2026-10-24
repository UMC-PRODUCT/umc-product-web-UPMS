import type { MatchingRound } from '../../model/types';

export const ROUNDS: MatchingRound[] = [1, 2, 3];

// 범례 점과 막대가 같은 색을 쓰도록 차수별 색을 한곳에서 관리
export const ROUND_BG_CLASS: Record<MatchingRound, string> = {
  1: 'bg-teal-500',
  2: 'bg-teal-300',
  3: 'bg-teal-200',
};
