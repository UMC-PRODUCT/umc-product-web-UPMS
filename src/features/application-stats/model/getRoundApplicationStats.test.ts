import { describe, expect, it } from 'vitest';

import { getCurrentRoundSummary, getRoundApplicationStats } from './getRoundApplicationStats';
import type { RoundProgress } from './types';

describe('getRoundApplicationStats', () => {
  it('1차는 전체 지원 가능 인원을 그대로 쓴다', () => {
    const stats = getRoundApplicationStats({
      eligibleCount: 400,
      rounds: [{ round: 1, applied: 30, matched: null }],
    });
    expect(stats[0]).toEqual({ round: 1, applied: 30, eligible: 400 });
  });

  it('이전 차수 매칭 인원을 빼서 다음 차수 지원 가능 인원을 구한다', () => {
    const stats = getRoundApplicationStats({
      eligibleCount: 400,
      rounds: [
        { round: 1, applied: 30, matched: 30 },
        { round: 2, applied: 120, matched: 100 },
        { round: 3, applied: null, matched: null },
      ],
    });
    expect(stats.map(({ eligible }) => eligible)).toEqual([400, 370, 270]);
  });

  it('지원자 일부만 매칭되면 매칭된 인원만 뺀다', () => {
    const stats = getRoundApplicationStats({
      eligibleCount: 400,
      rounds: [
        { round: 1, applied: 30, matched: 20 },
        { round: 2, applied: null, matched: null },
      ],
    });
    expect(stats[1].eligible).toBe(380);
  });

  it('이전 차수 매칭이 끝나지 않았으면 지원 가능 인원은 null', () => {
    const stats = getRoundApplicationStats({
      eligibleCount: 400,
      rounds: [
        { round: 1, applied: 30, matched: 30 },
        { round: 2, applied: 120, matched: null },
        { round: 3, applied: null, matched: null },
      ],
    });
    expect(stats.map(({ eligible }) => eligible)).toEqual([400, 370, null]);
  });
});

describe('getCurrentRoundSummary', () => {
  const progress: RoundProgress = {
    currentRound: 2,
    eligibleCount: 400,
    rounds: [
      { round: 1, applied: 30, matched: 30 },
      { round: 2, applied: 237, matched: null },
      { round: 3, applied: null, matched: null },
    ],
  };

  it('현재 차수의 지원 완료 / 지원 전 / 지원율을 구한다', () => {
    expect(getCurrentRoundSummary(progress)).toEqual({
      appliedCount: 237,
      notAppliedCount: 133,
      rate: 64,
    });
  });
});
