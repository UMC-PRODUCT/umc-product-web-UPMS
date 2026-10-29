import type { MatchingRoundsResponse } from '../api/getMatchingRounds';
import { getOpenRoundIds } from './getOpenRoundIds';

// 서버는 ID를 문자열로 줌
const rounds = [
  { id: '1', startsAt: '2026-11-13T00:00:00+09:00', endsAt: '2026-11-13T23:59:00+09:00' },
  { id: '2', startsAt: '2026-11-15T00:00:00+09:00', endsAt: '2026-11-15T23:59:00+09:00' },
] as unknown as MatchingRoundsResponse;

describe('getOpenRoundIds', () => {
  it('지금이 시작 ~ 마감 사이인 차수만 고른다', () => {
    expect(getOpenRoundIds(rounds, new Date('2026-11-13T12:00:00+09:00'))).toEqual(new Set([1]));
  });

  it('지원 기간인 차수가 없으면 빈 집합', () => {
    expect(getOpenRoundIds(rounds, new Date('2026-11-14T12:00:00+09:00'))).toEqual(new Set());
  });
});
