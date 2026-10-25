import { parseDate } from './scheduleFormat';
import type { MatchingScheduleSetting } from './types';

export type MatchingStep =
  | { status: 'BEFORE_START' } // 1차 지원 시작 전
  | { status: 'ONGOING'; phase: 'APPLY' | 'MATCHING'; round: 1 | 2 | 3 }
  | { status: 'ENDED' }; // 랜덤 매칭(최종 배정)까지 끝남

const DAYS_PER_ROUND = 2;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
// calculateSchedule 기준: 차수마다 첫날은 지원 기간, 다음 날은 PM 판정(매칭 기간)
// 3차 다음 날은 랜덤 매칭 기반 최종 배정 (20:00까지, 매칭 기간으로 취급)
const RANDOM_DAY_INDEX = 3 * DAYS_PER_ROUND;
const RANDOM_END_HOUR = 20;

// 시작일 기준으로 지금이 몇 차 지원 기간인지, 매칭 기간인지 계산
export const getCurrentMatchingStep = (
  { startDate }: Pick<MatchingScheduleSetting, 'startDate'>,
  now: Date,
): MatchingStep | null => {
  const start = parseDate(startDate);
  if (!start) return null;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayIndex = Math.round((today.getTime() - start.getTime()) / MS_PER_DAY);

  if (dayIndex < 0) return { status: 'BEFORE_START' };
  if (dayIndex > RANDOM_DAY_INDEX) return { status: 'ENDED' };
  if (dayIndex === RANDOM_DAY_INDEX) {
    return now.getHours() >= RANDOM_END_HOUR
      ? { status: 'ENDED' }
      : { status: 'ONGOING', phase: 'MATCHING', round: 3 };
  }

  return {
    status: 'ONGOING',
    phase: dayIndex % DAYS_PER_ROUND === 0 ? 'APPLY' : 'MATCHING',
    round: (Math.floor(dayIndex / DAYS_PER_ROUND) + 1) as 1 | 2 | 3,
  };
};
