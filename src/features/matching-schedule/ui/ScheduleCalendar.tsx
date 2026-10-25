import { Calendar } from '@umc-product/react';

import { parseDate } from '../model/scheduleFormat';
import type { MatchingSchedule } from '../model/types';
import RoundScheduleCardList from './RoundScheduleCardList';

type ScheduleCalendarProps = {
  schedule: MatchingSchedule | null; // 시작일 입력 전이면 null
  trackLabel: string; // 일정 카드 제목 (예: Plan-Design)
  now: Date;
};

// 피그마 차수별 일정 설정 달력: 디자인 시스템 Calendar + 차수별 일정 카드
// 전체 매칭 일정의 첫날 · 마지막 날은 청록 원, 사이 날짜는 하이라이트, 차수 시작일엔 점 (입력 즉시 반영)
// 시작일이 바뀌면 그 달로 넘어가도록 부모에서 key로 다시 그림
const ScheduleCalendar = ({ schedule, trackLabel, now }: ScheduleCalendarProps) => {
  const start = parseDate(schedule?.overall.start.date ?? null);
  const end = parseDate(schedule?.overall.end.date ?? null);
  const roundStarts = (schedule?.rounds ?? [])
    .map(({ period }) => parseDate(period.start.date))
    .filter((date): date is Date => date !== null);

  return (
    <div className="flex w-[400px] shrink-0 flex-col items-center gap-4 rounded-2xl border border-teal-grey-75 bg-white px-3 pt-2 pb-3 shadow-drop-neutral-3">
      <Calendar
        // 날짜를 눌러 고르는 달력이 아니라 일정을 보여 주기만 함
        value={null}
        defaultMonth={start ?? now}
        ranges={start && end ? [{ start, end }] : []}
        markedDates={roundStarts}
        // 피그마: 카드 안 달력은 테두리 없음
        className="border-0"
      />
      {schedule && (
        <RoundScheduleCardList rounds={schedule.rounds} trackLabel={trackLabel} now={now} />
      )}
    </div>
  );
};

export default ScheduleCalendar;
