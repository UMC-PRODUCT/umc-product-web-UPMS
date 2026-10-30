import {
  isAnnounceTimeAllowed,
  isStartDateAllowed,
  toMatchingRoundsBody,
} from './toMatchingRoundRequests';
import { toScheduleByTrack } from './toScheduleByTrack';

// 실행 환경 시간대와 상관없이 같은 결과가 나오도록 로컬 시각으로 ISO를 만듦
const at = (day: number, hours: number, minutes = 0) =>
  new Date(2026, 10, day, hours, minutes).toISOString();

const FIVE_MINUTES = 5 * 60 * 1000;

describe('toMatchingRoundsBody', () => {
  const body = toMatchingRoundsBody(
    { startDate: '2026-11-13', announceTime: '22:00' },
    'PLAN_DESIGN',
  );
  const rounds = body?.rounds ?? [];

  it('운영표대로 차수 4개를 만든다: 지원 → 다음 날 20:00 판정 마감 → 다음 날 발표', () => {
    expect(body?.type).toBe('PLAN_DESIGN');
    expect(rounds).toEqual([
      {
        name: 'Plan-Design 1차',
        phase: 'FIRST',
        startsAt: at(13, 0),
        endsAt: at(13, 23, 59),
        decisionDeadline: at(14, 20),
        resultPublishAt: at(14, 22),
      },
      {
        name: 'Plan-Design 2차',
        phase: 'SECOND',
        startsAt: at(15, 0),
        endsAt: at(15, 23, 59),
        decisionDeadline: at(16, 20),
        resultPublishAt: at(16, 22),
      },
      {
        name: 'Plan-Design 3차',
        phase: 'THIRD',
        startsAt: at(17, 0),
        endsAt: at(17, 23, 59),
        decisionDeadline: at(18, 20),
        resultPublishAt: at(18, 22),
      },
      // 랜덤 매칭은 판정 마감을 보내지 않음 (서버가 끝 시각을 판정 마감으로 저장)
      {
        name: 'Plan-Design 랜덤 매칭',
        phase: 'RANDOM_MATCHING',
        startsAt: at(19, 0),
        endsAt: at(19, 20),
        resultPublishAt: at(19, 22),
      },
    ]);
  });

  it('서버 순서 규칙을 지킨다 (1~3차는 끝 < 마감, 발표는 마감(랜덤은 끝) 5분 뒤 이후)', () => {
    for (const { startsAt, endsAt, decisionDeadline, resultPublishAt } of rounds) {
      const [start, end, deadline, publish] = [
        startsAt,
        endsAt,
        decisionDeadline ?? endsAt,
        resultPublishAt,
      ].map((iso) => new Date(iso).getTime());
      expect(start).toBeLessThan(end);
      expect(end).toBeLessThanOrEqual(deadline);
      expect(publish - deadline).toBeGreaterThanOrEqual(FIVE_MINUTES);
    }
  });

  it('Plan-PE 탭은 서버 PLAN_DEVELOPER로 보낸다', () => {
    const peBody = toMatchingRoundsBody(
      { startDate: '2026-11-13', announceTime: '22:00' },
      'PLAN_PE',
    );
    expect(peBody?.type).toBe('PLAN_DEVELOPER');
    expect(peBody?.rounds[0]).toMatchObject({ name: 'Plan-PE 1차' });
  });

  it('시작일이나 발표 시각이 없으면 보낼 내용이 없다', () => {
    expect(
      toMatchingRoundsBody({ startDate: null, announceTime: '22:00' }, 'PLAN_DESIGN'),
    ).toBeNull();
    expect(
      toMatchingRoundsBody({ startDate: '2026-11-13', announceTime: null }, 'PLAN_DESIGN'),
    ).toBeNull();
  });

  it('저장한 차수를 다시 불러오면 같은 입력값이 나온다 (새로고침해도 유지)', () => {
    // 서버 응답에는 차수마다 type이 있고, 랜덤 매칭의 판정 마감은 끝 시각으로 옴
    const saved = rounds.map((round) => ({
      ...round,
      type: body?.type,
      decisionDeadline: round.decisionDeadline ?? round.endsAt,
    }));
    expect(toScheduleByTrack(saved).PLAN_DESIGN.setting).toEqual({
      startDate: '2026-11-13',
      announceTime: '22:00',
    });
  });
});

describe('isAnnounceTimeAllowed', () => {
  it.each([
    ['20:05', true],
    ['22:00', true],
    ['20:04', false],
    ['09:00', false],
  ])('%s → %s', (time, expected) => {
    expect(isAnnounceTimeAllowed(time)).toBe(expected);
  });

  it('비어 있으면 false', () => {
    expect(isAnnounceTimeAllowed(null)).toBe(false);
  });
});

describe('isStartDateAllowed', () => {
  // 10/29 오후 3시 기준
  const now = new Date(2026, 9, 29, 15, 0);

  it.each<[string | null, boolean]>([
    ['2026-10-30', true], // 내일 0시 시작
    ['2026-10-29', false], // 오늘 0시는 이미 지남
    ['2026-10-28', false],
    [null, false],
    ['2026-13-01', false],
  ])('%s → %s', (startDate, expected) => {
    expect(isStartDateAllowed(startDate, now)).toBe(expected);
  });
});
