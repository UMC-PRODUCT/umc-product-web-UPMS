import type { components } from '@/types/api';

import { toDateString, toTimeString } from './scheduleFormat';
import type {
  MatchingSchedule,
  MatchingScheduleSetting,
  MatchingTrack,
  ScheduleDateTime,
  ScheduleRound,
} from './types';

type MatchingRoundResponse = components['schemas']['ProjectMatchingRoundResponse'];

// 서버 type → 화면 탭 (서버는 PE를 DEVELOPER로 부름)
const TRACK: Record<NonNullable<MatchingRoundResponse['type']>, MatchingTrack> = {
  PLAN_DESIGN: 'PLAN_DESIGN',
  PLAN_DEVELOPER: 'PLAN_PE',
};

const ROUND: Record<NonNullable<MatchingRoundResponse['phase']>, ScheduleRound> = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
  RANDOM_MATCHING: 'RANDOM',
};

const ROUND_ORDER: ScheduleRound[] = [1, 2, 3, 'RANDOM'];

export type TrackSchedule = {
  setting: MatchingScheduleSetting; // 입력 칸에 채울 값
  schedule: MatchingSchedule | null; // 달력 · 차수별 기간에 보여 줄 서버 일정 (차수가 없으면 null)
};

// ISO 시각을 브라우저 시간대(KST) 날짜 · 시각으로 나눔
const toDateTime = (iso: string | undefined): ScheduleDateTime | null => {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? null
    : { date: toDateString(date), time: toTimeString(date) };
};

const toTrackSchedule = (rounds: MatchingRoundResponse[]): TrackSchedule => {
  const periods = rounds
    .flatMap(({ phase, startsAt, endsAt }) => {
      const start = toDateTime(startsAt);
      const end = toDateTime(endsAt);
      return phase && start && end ? [{ round: ROUND[phase], period: { start, end } }] : [];
    })
    .sort((left, right) => ROUND_ORDER.indexOf(left.round) - ROUND_ORDER.indexOf(right.round));

  // 피그마 입력 칸: 전체 매칭 시작일 = 1차 시작일, 매칭 결과발표 = 1차 발표 시각 (차수마다 같은 시각)
  const first = rounds.find(({ phase }) => phase === 'FIRST');
  const setting: MatchingScheduleSetting = {
    startDate: toDateTime(first?.startsAt)?.date ?? null,
    announceTime: toDateTime(first?.resultPublishAt)?.time ?? null,
  };

  return {
    setting,
    schedule:
      periods.length > 0
        ? {
            overall: {
              start: periods[0].period.start,
              end: periods[periods.length - 1].period.end,
            },
            rounds: periods,
          }
        : null,
  };
};

// 한 지부의 매칭 차수 목록을 탭(Plan-Design · Plan-PE)별 입력값 · 일정으로 바꿈
export const toScheduleByTrack = (
  rounds: MatchingRoundResponse[],
): Record<MatchingTrack, TrackSchedule> => ({
  PLAN_DESIGN: toTrackSchedule(rounds.filter(({ type }) => type && TRACK[type] === 'PLAN_DESIGN')),
  PLAN_PE: toTrackSchedule(rounds.filter(({ type }) => type && TRACK[type] === 'PLAN_PE')),
});
