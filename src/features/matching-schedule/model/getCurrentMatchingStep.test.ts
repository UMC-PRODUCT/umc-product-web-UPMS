import { getCurrentMatchingStep } from './getCurrentMatchingStep';

// 시작일 2026-10-23: 1차 23(지원)·24(매칭), 2차 25·26, 3차 27·28, 랜덤 29
const setting = { startDate: '2026-10-23' };
const at = (date: string, hour = 12) => new Date(`${date}T${String(hour).padStart(2, '0')}:00:00`);

describe('getCurrentMatchingStep', () => {
  it('시작일이 없으면 null이다', () => {
    expect(getCurrentMatchingStep({ startDate: null }, at('2026-10-23'))).toBeNull();
  });

  it('시작 전에는 BEFORE_START다', () => {
    expect(getCurrentMatchingStep(setting, at('2026-10-22'))).toEqual({ status: 'BEFORE_START' });
  });

  it('차수 첫날은 지원 기간, 다음 날은 매칭 기간이다', () => {
    expect(getCurrentMatchingStep(setting, at('2026-10-23'))).toEqual({
      status: 'ONGOING',
      phase: 'APPLY',
      round: 1,
    });
    expect(getCurrentMatchingStep(setting, at('2026-10-24'))).toEqual({
      status: 'ONGOING',
      phase: 'MATCHING',
      round: 1,
    });
    expect(getCurrentMatchingStep(setting, at('2026-10-25'))).toMatchObject({
      phase: 'APPLY',
      round: 2,
    });
    expect(getCurrentMatchingStep(setting, at('2026-10-28'))).toMatchObject({
      phase: 'MATCHING',
      round: 3,
    });
  });

  it('랜덤 매칭 날은 20시까지 3차 매칭 기간으로 보고, 그 뒤로는 끝이다', () => {
    expect(getCurrentMatchingStep(setting, at('2026-10-29', 19))).toMatchObject({
      phase: 'MATCHING',
      round: 3,
    });
    expect(getCurrentMatchingStep(setting, at('2026-10-29', 20))).toEqual({ status: 'ENDED' });
    expect(getCurrentMatchingStep(setting, at('2026-10-30'))).toEqual({ status: 'ENDED' });
  });
});
