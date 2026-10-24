import { isMatchingRoundOpen } from './matchingRound';

describe('isMatchingRoundOpen', () => {
  it('진행 중인 차수(mock: 3차)만 배정 상태를 바꿀 수 있다', () => {
    expect(isMatchingRoundOpen(3)).toBe(true);
  });

  it('매칭이 끝난 차수는 결과가 확정돼 바꿀 수 없다', () => {
    expect(isMatchingRoundOpen(1)).toBe(false);
    expect(isMatchingRoundOpen(2)).toBe(false);
  });
});
