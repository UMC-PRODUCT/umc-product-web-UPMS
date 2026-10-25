import { addDays, parseDate, toDateString } from './scheduleFormat';
import type {
  MatchingSchedule,
  MatchingScheduleSetting,
  SchedulePeriod,
  ScheduleRound,
} from './types';

// 피그마 '1. 매칭일정' 운영표: 차수마다 이틀
// 첫날 00:00 ~ 23:59 지원 → 다음 날 00:00 ~ 20:00 PM 판정 후 결과 발표
// 3차가 끝난 다음 날은 랜덤 매칭 기반 운영진 최종 인원 배정 (00:00 ~ 20:00) 후 최종 결과 발표
const DAYS_PER_ROUND = 2;
const ROUNDS: ScheduleRound[] = [1, 2, 3, 'RANDOM'];

const DAY_START = '00:00';
const DAY_END = '23:59';
const RANDOM_END = '20:00';

// 피그마 주석: 전체 매칭 일정 시작일만 입력하면 나머지 칸은 자동 계산
// rounds의 기간은 차수별 '지원 기간' (랜덤 매칭은 운영진 조정 기간), 전체 일정은 랜덤 매칭 날까지
export const calculateSchedule = ({
  startDate,
}: Pick<MatchingScheduleSetting, 'startDate'>): MatchingSchedule | null => {
  const start = parseDate(startDate);
  if (!start) return null;

  const rounds = ROUNDS.map((round, index) => {
    const date = toDateString(addDays(start, index * DAYS_PER_ROUND));
    return {
      round,
      period: {
        start: { date, time: DAY_START },
        end: { date, time: round === 'RANDOM' ? RANDOM_END : DAY_END },
      },
    };
  });

  return {
    overall: { start: rounds[0].period.start, end: rounds[rounds.length - 1].period.end },
    rounds,
  };
};

// 피그마 안내: 1차 매칭이 시작되면 매칭 일정을 바꿀 수 없음
export const isScheduleLocked = (
  { startDate }: Pick<MatchingScheduleSetting, 'startDate'>,
  now: Date,
) => {
  const start = parseDate(startDate);
  return start !== null && now.getTime() >= start.getTime();
};

const toDateTime = ({ date, time }: SchedulePeriod['start']) => {
  const day = parseDate(date);
  const [hours, minutes] = time.split(':').map(Number);
  return day ? new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes) : null;
};

// 달력 아래 일정 카드 상태: 끝난 기간 · 진행 중인 기간 · 예정된 기간
export const getPeriodStatus = (
  period: SchedulePeriod,
  now: Date,
): 'past' | 'ongoing' | 'upcoming' => {
  const start = toDateTime(period.start);
  const end = toDateTime(period.end);
  if (end && now.getTime() > end.getTime()) return 'past';
  if (start && now.getTime() >= start.getTime()) return 'ongoing';
  return 'upcoming';
};
