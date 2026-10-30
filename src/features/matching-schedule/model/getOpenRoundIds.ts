import { toId } from '@/shared/api/toId';

import type { MatchingRoundsResponse } from '../api/getMatchingRounds';

// 지금 지원 기간(시작 ~ 마감)인 매칭 차수 ID. 서버 규칙: 이 기간에만 지원 취소 가능
export const getOpenRoundIds = (rounds: MatchingRoundsResponse, now: Date): Set<number> =>
  new Set(
    rounds.flatMap(({ id, startsAt, endsAt }) => {
      // ID가 문자열로 와서 숫자로 맞춤
      const roundId = toId(id);
      if (roundId === null || !startsAt || !endsAt) return [];
      const isOpen = new Date(startsAt) <= now && now <= new Date(endsAt);
      return isOpen ? [roundId] : [];
    }),
  );
