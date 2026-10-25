import { calculateSchedule, getPeriodStatus, isScheduleLocked } from './calculateSchedule';
import { formatDateDigits, formatTimeDigits, isValidTime, parseDate } from './scheduleFormat';

describe('formatDateDigits', () => {
  it.each([
    ['2026', '2026'],
    ['20261', '2026-1'],
    ['2026101', '2026-10-1'],
    ['20261001', '2026-10-01'],
    ['2026-10-01', '2026-10-01'],
    ['2026a10b0199', '2026-10-01'],
  ])('%s → %s', (input, expected) => {
    expect(formatDateDigits(input)).toBe(expected);
  });
});

describe('formatTimeDigits', () => {
  it.each([
    ['2', '2'],
    ['220', '22:0'],
    ['2200', '22:00'],
    ['22:001', '22:00'],
  ])('%s → %s', (input, expected) => {
    expect(formatTimeDigits(input)).toBe(expected);
  });
});

describe('parseDate · isValidTime', () => {
  it('없는 날짜와 덜 입력한 날짜는 null', () => {
    expect(parseDate('2026-02-30')).toBeNull();
    expect(parseDate('2026-10')).toBeNull();
    expect(parseDate(null)).toBeNull();
    expect(parseDate('2026-10-01')).toEqual(new Date(2026, 9, 1));
  });

  it('00:00 ~ 23:59만 올바른 시각', () => {
    expect(isValidTime('23:59')).toBe(true);
    expect(isValidTime('24:00')).toBe(false);
    expect(isValidTime('9:00')).toBe(false);
    expect(isValidTime(null)).toBe(false);
  });
});

describe('calculateSchedule', () => {
  it('시작일이 없거나 올바르지 않으면 계산하지 않는다', () => {
    expect(calculateSchedule({ startDate: null })).toBeNull();
    expect(calculateSchedule({ startDate: '2026-13-01' })).toBeNull();
  });

  it('차수마다 이틀(지원 · 매칭)씩 이어 붙이고, 3차 다음 날이 랜덤 매칭', () => {
    // 피그마 운영표: 11/13 1차 지원 → 11/15 2차 → 11/17 3차 → 11/19 랜덤 매칭 · 최종 발표
    const schedule = calculateSchedule({ startDate: '2026-11-13' });

    expect(schedule?.rounds.map(({ round, period }) => [round, period])).toEqual([
      [
        1,
        {
          start: { date: '2026-11-13', time: '00:00' },
          end: { date: '2026-11-13', time: '23:59' },
        },
      ],
      [
        2,
        {
          start: { date: '2026-11-15', time: '00:00' },
          end: { date: '2026-11-15', time: '23:59' },
        },
      ],
      [
        3,
        {
          start: { date: '2026-11-17', time: '00:00' },
          end: { date: '2026-11-17', time: '23:59' },
        },
      ],
      [
        'RANDOM',
        {
          start: { date: '2026-11-19', time: '00:00' },
          end: { date: '2026-11-19', time: '20:00' },
        },
      ],
    ]);
    expect(schedule?.overall).toEqual({
      start: { date: '2026-11-13', time: '00:00' },
      end: { date: '2026-11-19', time: '20:00' },
    });
  });
});

describe('getPeriodStatus', () => {
  const period = {
    start: { date: '2026-10-25', time: '00:00' },
    end: { date: '2026-10-25', time: '23:59' },
  };

  it('기간 전 · 중 · 후를 나눈다', () => {
    expect(getPeriodStatus(period, new Date(2026, 9, 24, 23, 59))).toBe('upcoming');
    expect(getPeriodStatus(period, new Date(2026, 9, 25, 12))).toBe('ongoing');
    expect(getPeriodStatus(period, new Date(2026, 9, 26, 0, 0))).toBe('past');
  });
});

describe('isScheduleLocked', () => {
  const now = new Date(2026, 9, 25, 12);

  it('1차 매칭 시작일이 지나면 잠긴다', () => {
    expect(isScheduleLocked({ startDate: '2026-10-25' }, now)).toBe(true);
    expect(isScheduleLocked({ startDate: '2026-10-12' }, now)).toBe(true);
  });

  it('시작 전이거나 아직 설정 전이면 잠기지 않는다', () => {
    expect(isScheduleLocked({ startDate: '2026-10-26' }, now)).toBe(false);
    expect(isScheduleLocked({ startDate: null }, now)).toBe(false);
  });
});
