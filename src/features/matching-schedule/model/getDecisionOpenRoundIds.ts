import { toId } from '@/shared/api/toId';

import type { MatchingRoundsResponse } from '../api/getMatchingRounds';

// 지금 합격 · 불합격을 정할 수 있는 매칭 차수 ID
// 서버 규칙: 지원 마감 후부터 결정 마감(decisionDeadline)까지만 배정 상태를 바꿀 수 있음
export const getDecisionOpenRoundIds = (rounds: MatchingRoundsResponse, now: Date): Set<number> =>
  new Set(
    rounds.flatMap(({ id, endsAt, decisionDeadline }) => {
      // ID가 문자열로 와서 숫자로 맞춤
      const roundId = toId(id);
      if (roundId === null || !endsAt || !decisionDeadline) return [];
      const isOpen = new Date(endsAt) < now && now <= new Date(decisionDeadline);
      return isOpen ? [roundId] : [];
    }),
  );
