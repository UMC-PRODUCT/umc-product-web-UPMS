import type { MatchingRoundsResponse } from '../api/getMatchingRounds';
import { getDecisionOpenRoundIds } from './getDecisionOpenRoundIds';

// 서버는 ID를 문자열로 줌. 1차: 13일 지원 → 14일 20:00 결정 마감
const rounds = [
  {
    id: '1',
    endsAt: '2026-11-13T23:59:00+09:00',
    decisionDeadline: '2026-11-14T20:00:00+09:00',
  },
] as unknown as MatchingRoundsResponse;

describe('getDecisionOpenRoundIds', () => {
  it.each([
    ['지원 기간 중', '2026-11-13T12:00:00+09:00', []],
    ['지원 마감 후 결정 마감 전', '2026-11-14T10:00:00+09:00', [1]],
    ['결정 마감 후', '2026-11-14T20:01:00+09:00', []],
  ])('%s', (_, now, expected) => {
    expect(getDecisionOpenRoundIds(rounds, new Date(now))).toEqual(new Set(expected));
  });
});
