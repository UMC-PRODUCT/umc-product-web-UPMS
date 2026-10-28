import { isAnnounceTimeAllowed, toMatchingRoundRequests } from './toMatchingRoundRequests';
import { toScheduleByTrack } from './toScheduleByTrack';

// 실행 환경 시간대와 상관없이 같은 결과가 나오도록 로컬 시각으로 ISO를 만듦
const at = (day: number, hours: number, minutes = 0) =>
  new Date(2026, 10, day, hours, minutes).toISOString();

const FIVE_MINUTES = 5 * 60 * 1000;

describe('toMatchingRoundRequests', () => {
  const requests = toMatchingRoundRequests(
    { startDate: '2026-11-13', announceTime: '22:00' },
    'PLAN_DESIGN',
  );

  it('운영표대로 차수 4개를 만든다: 지원 → 다음 날 20:00 판정 마감 → 다음 날 발표', () => {
    expect(requests).toEqual([
      {
        name: 'Plan-Design 1차',
        type: 'PLAN_DESIGN',
        phase: 'FIRST',
        startsAt: at(13, 0),
        endsAt: at(13, 23, 59),
        decisionDeadline: at(14, 20),
        resultPublishAt: at(14, 22),
      },
      {
        name: 'Plan-Design 2차',
        type: 'PLAN_DESIGN',
        phase: 'SECOND',
        startsAt: at(15, 0),
        endsAt: at(15, 23, 59),
        decisionDeadline: at(16, 20),
        resultPublishAt: at(16, 22),
      },
      {
        name: 'Plan-Design 3차',
        type: 'PLAN_DESIGN',
        phase: 'THIRD',
        startsAt: at(17, 0),
        endsAt: at(17, 23, 59),
        decisionDeadline: at(18, 20),
        resultPublishAt: at(18, 22),
      },
      {
        name: 'Plan-Design 랜덤 매칭',
        type: 'PLAN_DESIGN',
        phase: 'RANDOM_MATCHING',
        startsAt: at(19, 0),
        endsAt: at(19, 20),
        decisionDeadline: at(19, 20),
        resultPublishAt: at(19, 22),
      },
    ]);
  });

  it('서버 순서 규칙을 지킨다 (1~3차는 끝 < 마감, 랜덤은 끝 = 마감, 발표는 마감 5분 뒤 이후)', () => {
    for (const { phase, startsAt, endsAt, decisionDeadline, resultPublishAt } of requests) {
      const [start, end, deadline, publish] = [
        startsAt,
        endsAt,
        decisionDeadline,
        resultPublishAt,
      ].map((iso) => new Date(iso).getTime());
      expect(start).toBeLessThan(end);
      if (phase === 'RANDOM_MATCHING') expect(end).toBe(deadline);
      else expect(end).toBeLessThan(deadline);
      expect(publish - deadline).toBeGreaterThanOrEqual(FIVE_MINUTES);
    }
  });

  it('Plan-PE 탭은 서버 PLAN_DEVELOPER로 보낸다', () => {
    const [first] = toMatchingRoundRequests(
      { startDate: '2026-11-13', announceTime: '22:00' },
      'PLAN_PE',
    );
    expect(first).toMatchObject({ type: 'PLAN_DEVELOPER', name: 'Plan-PE 1차' });
  });

  it('시작일이나 발표 시각이 없으면 보낼 차수가 없다', () => {
    expect(
      toMatchingRoundRequests({ startDate: null, announceTime: '22:00' }, 'PLAN_DESIGN'),
    ).toEqual([]);
    expect(
      toMatchingRoundRequests({ startDate: '2026-11-13', announceTime: null }, 'PLAN_DESIGN'),
    ).toEqual([]);
  });

  it('저장한 차수를 다시 불러오면 같은 입력값이 나온다 (새로고침해도 유지)', () => {
    expect(toScheduleByTrack(requests).PLAN_DESIGN.setting).toEqual({
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
