import { CalendarScheduleCard } from '@umc-product/react';

import { getPeriodStatus } from '../model/calculateSchedule';
import { parseDate } from '../model/scheduleFormat';
import type { MatchingSchedule, ScheduleDateTime, ScheduleRound } from '../model/types';

const ROUND_LABEL: Record<ScheduleRound, string> = {
  1: '1차',
  2: '2차',
  3: '3차',
  RANDOM: '4차',
};

// "10월 22일 00:00"
const formatDateTime = ({ date, time }: ScheduleDateTime) => {
  const day = parseDate(date);
  return day ? `${day.getMonth() + 1}월 ${day.getDate()}일 ${time}` : time;
};

type RoundScheduleCardListProps = {
  rounds: MatchingSchedule['rounds'];
  trackLabel: string; // 예: Plan-Design
  now: Date;
};

// 피그마 달력 아래 일정 카드: 디자인 시스템 Calendar/Schedule Card
// 끝난 차수는 회색 + 체크, 진행 중인 차수는 연한 청록 배경
const RoundScheduleCardList = ({ rounds, trackLabel, now }: RoundScheduleCardListProps) => (
  <ul className="flex w-full flex-col gap-[7px]">
    {rounds.map(({ round, period }) => (
      <li key={round}>
        <CalendarScheduleCard
          status={getPeriodStatus(period, now)}
          label={ROUND_LABEL[round]}
          title={round === 'RANDOM' ? '랜덤 매칭' : `${trackLabel} 지원기간`}
          start={formatDateTime(period.start)}
          // 같은 날 끝나면 시각만
          end={period.end.date === period.start.date ? period.end.time : formatDateTime(period.end)}
        />
      </li>
    ))}
  </ul>
);

export default RoundScheduleCardList;
