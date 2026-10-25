// 매칭 차수 설정 탭: Plan - Design 매칭 / Plan - PE 매칭
export type MatchingTrack = 'PLAN_DESIGN' | 'PLAN_PE';

export type ScheduleRound = 1 | 2 | 3 | 'RANDOM';

export type ScheduleDateTime = {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
};

export type SchedulePeriod = {
  start: ScheduleDateTime;
  end: ScheduleDateTime;
};

// 운영진이 직접 입력하는 값 (피그마: 전체 매칭 일정 시작일 · 매칭 결과 발표 시각만 입력)
export type MatchingScheduleSetting = {
  startDate: string | null; // YYYY-MM-DD
  announceTime: string | null; // HH:MM
};

// 시작일로 자동 계산한 전체 · 차수별 일정
export type MatchingSchedule = {
  overall: SchedulePeriod;
  rounds: { round: ScheduleRound; period: SchedulePeriod }[];
};
