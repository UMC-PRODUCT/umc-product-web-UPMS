import type { components } from '@/types/api';

import { toScheduleByTrack } from './toScheduleByTrack';

type MatchingRoundResponse = components['schemas']['ProjectMatchingRoundResponse'];

// 실행 환경 시간대와 상관없이 같은 결과가 나오도록 로컬 시각으로 ISO를 만듦
const at = (day: number, hours: number, minutes = 0) =>
  new Date(2026, 10, day, hours, minutes).toISOString();

// 피그마 운영표처럼 차수마다 이틀: 첫날 지원 → 다음 날 20:00 판정 마감 → 22:00 발표
const round = (
  type: MatchingRoundResponse['type'],
  phase: MatchingRoundResponse['phase'],
  day: number,
): MatchingRoundResponse => ({
  type,
  phase,
  startsAt: at(day, 0),
  endsAt: phase === 'RANDOM_MATCHING' ? at(day, 20) : at(day, 23, 59),
  decisionDeadline: at(phase === 'RANDOM_MATCHING' ? day : day + 1, 20),
  resultPublishAt: at(phase === 'RANDOM_MATCHING' ? day : day + 1, 22),
});

describe('toScheduleByTrack', () => {
  const rounds = [
    // 서버 정렬과 상관없이 차수 순서로 맞추는지 보려고 섞어 둠
    round('PLAN_DESIGN', 'THIRD', 17),
    round('PLAN_DESIGN', 'FIRST', 13),
    round('PLAN_DESIGN', 'RANDOM_MATCHING', 19),
    round('PLAN_DESIGN', 'SECOND', 15),
    round('PLAN_DEVELOPER', 'FIRST', 20),
  ];

  it('1차 시작일과 발표 시각을 입력 칸 값으로 쓴다', () => {
    expect(toScheduleByTrack(rounds).PLAN_DESIGN.setting).toEqual({
      startDate: '2026-11-13',
      announceTime: '22:00',
    });
  });

  it('차수별 기간을 1 · 2 · 3 · 랜덤 순서로, 전체 일정은 첫 차수 시작 ~ 마지막 차수 끝으로', () => {
    const { schedule } = toScheduleByTrack(rounds).PLAN_DESIGN;

    expect(schedule?.rounds).toEqual([
      {
        round: 1,
        period: {
          start: { date: '2026-11-13', time: '00:00' },
          end: { date: '2026-11-13', time: '23:59' },
        },
      },
      {
        round: 2,
        period: {
          start: { date: '2026-11-15', time: '00:00' },
          end: { date: '2026-11-15', time: '23:59' },
        },
      },
      {
        round: 3,
        period: {
          start: { date: '2026-11-17', time: '00:00' },
          end: { date: '2026-11-17', time: '23:59' },
        },
      },
      {
        round: 'RANDOM',
        period: {
          start: { date: '2026-11-19', time: '00:00' },
          end: { date: '2026-11-19', time: '20:00' },
        },
      },
    ]);
    expect(schedule?.overall).toEqual({
      start: { date: '2026-11-13', time: '00:00' },
      end: { date: '2026-11-19', time: '20:00' },
    });
  });

  it('서버의 PLAN_DEVELOPER는 Plan-PE 탭으로 간다', () => {
    expect(toScheduleByTrack(rounds).PLAN_PE.setting.startDate).toBe('2026-11-20');
  });

  it('차수가 없는 탭은 빈 입력값에 일정 null', () => {
    expect(toScheduleByTrack([round('PLAN_DESIGN', 'FIRST', 13)]).PLAN_PE).toEqual({
      setting: { startDate: null, announceTime: null },
      schedule: null,
    });
  });

  it('1차가 없으면 입력 칸은 비우고, 있는 차수만 일정에 넣는다', () => {
    const { setting, schedule } = toScheduleByTrack([
      round('PLAN_DESIGN', 'SECOND', 15),
    ]).PLAN_DESIGN;

    expect(setting).toEqual({ startDate: null, announceTime: null });
    expect(schedule?.rounds.map(({ round }) => round)).toEqual([2]);
  });
});
