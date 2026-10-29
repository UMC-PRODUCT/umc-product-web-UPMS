import type { components } from '@/types/api';

import { calculateSchedule } from './calculateSchedule';
import { addDays, parseDate, toDateString } from './scheduleFormat';
import type {
  MatchingScheduleSetting,
  MatchingTrack,
  ScheduleDateTime,
  ScheduleRound,
} from './types';

type MatchingRoundRequest = Omit<
  components['schemas']['CreateProjectMatchingRoundRequest'],
  'chapterId'
>;
type Phase = NonNullable<MatchingRoundRequest['phase']>;

// 화면 탭 → 서버 type (서버는 PE를 DEVELOPER로 부름)
const SERVER_TRACK: Record<MatchingTrack, NonNullable<MatchingRoundRequest['type']>> = {
  PLAN_DESIGN: 'PLAN_DESIGN',
  PLAN_PE: 'PLAN_DEVELOPER',
};

const TRACK_NAME: Record<MatchingTrack, string> = {
  PLAN_DESIGN: 'Plan-Design',
  PLAN_PE: 'Plan-PE',
};

const PHASE: Record<ScheduleRound, Phase> = {
  1: 'FIRST',
  2: 'SECOND',
  3: 'THIRD',
  RANDOM: 'RANDOM_MATCHING',
};

// 피그마 '1. 매칭일정' 운영표: 지원 다음 날 20:00까지 PM 판정, 랜덤 매칭은 20:00에 배정 마감
const DECISION_DEADLINE = '20:00';

// 서버 규칙: 발표는 판정 마감(20:00)으로부터 최소 5분 뒤 (자동 선발 처리 시간)
export const MIN_ANNOUNCE_TIME = '20:05';

// "HH:MM" 형식이라 문자열 비교로 시각 순서를 비교함
export const isAnnounceTimeAllowed = (announceTime: string | null) =>
  announceTime !== null && announceTime >= MIN_ANNOUNCE_TIME;

// 서버 규칙: 시작 시각이 이미 지난 차수는 만들 수 없음 (1차 매칭이 시작된 것으로 봄)
// 1차는 시작일 0시에 시작하므로 시작일은 내일 이후여야 함
export const isStartDateAllowed = (startDate: string | null, now: Date) => {
  const start = startDate ? parseDate(startDate) : null;
  return start !== null && start > now;
};

// 로컬(KST) 날짜 · 시각을 서버로 보낼 ISO 문자열로
const toIso = ({ date, time }: ScheduleDateTime) => {
  const day = parseDate(date);
  const [hours, minutes] = time.split(':').map(Number);
  if (!day) throw new Error(`올바르지 않은 날짜: ${date}`);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes).toISOString();
};

const nextDay = (date: string) => {
  const day = parseDate(date);
  if (!day) throw new Error(`올바르지 않은 날짜: ${date}`);
  return toDateString(addDays(day, 1));
};

// 입력값(시작일 · 발표 시각)으로 서버에 저장할 차수 4개를 만듦. 기간은 화면의 자동 계산과 같음
// 1~3차: 지원 기간 → 다음 날 20:00 PM 판정 마감 → 다음 날 발표
// 랜덤 매칭: 00:00 ~ 20:00 운영진 배정(마감 = 끝) → 같은 날 발표
export const toMatchingRoundRequests = (
  setting: MatchingScheduleSetting,
  track: MatchingTrack,
): MatchingRoundRequest[] => {
  const schedule = calculateSchedule(setting);
  const { announceTime } = setting;
  if (!schedule || !announceTime) return [];

  return schedule.rounds.map(({ round, period }) => {
    const isRandom = round === 'RANDOM';
    const decisionDate = isRandom ? period.end.date : nextDay(period.end.date);
    return {
      name: isRandom ? `${TRACK_NAME[track]} 랜덤 매칭` : `${TRACK_NAME[track]} ${round}차`,
      type: SERVER_TRACK[track],
      phase: PHASE[round],
      startsAt: toIso(period.start),
      endsAt: toIso(period.end),
      decisionDeadline: isRandom
        ? toIso(period.end)
        : toIso({ date: decisionDate, time: DECISION_DEADLINE }),
      resultPublishAt: toIso({ date: decisionDate, time: announceTime }),
    };
  });
};
