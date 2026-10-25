import type { MatchingScheduleSetting, MatchingTrack } from './types';

const EMPTY: MatchingScheduleSetting = { startDate: null, announceTime: null };

// TODO: 지부별 매칭 일정 API 연동
// 아홀로틀은 1차 매칭이 이미 시작돼 수정할 수 없는 상태 (Design은 2차 지원 중, PE는 모두 끝남), 수달은 아직 설정 전
export const MOCK_MATCHING_SCHEDULES: Record<
  string,
  Record<MatchingTrack, MatchingScheduleSetting>
> = {
  kangaroo: {
    PLAN_DESIGN: { startDate: '2026-11-13', announceTime: '22:00' },
    PLAN_PE: { startDate: '2026-11-13', announceTime: '22:00' },
  },
  axolotl: {
    PLAN_DESIGN: { startDate: '2026-10-23', announceTime: '22:00' },
    PLAN_PE: { startDate: '2026-10-19', announceTime: '21:00' },
  },
  tyranno: {
    PLAN_DESIGN: { startDate: '2026-11-02', announceTime: '20:00' },
    PLAN_PE: EMPTY,
  },
  quokka: {
    PLAN_DESIGN: { startDate: '2026-11-16', announceTime: '22:00' },
    PLAN_PE: { startDate: '2026-11-16', announceTime: '22:00' },
  },
  otter: { PLAN_DESIGN: EMPTY, PLAN_PE: EMPTY },
};
