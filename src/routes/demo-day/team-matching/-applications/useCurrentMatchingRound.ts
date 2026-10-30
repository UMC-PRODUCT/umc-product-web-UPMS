import { useState } from 'react';

import type { MatchingRoundType } from '@/features/application-stats';
import {
  getCurrentMatchingStep,
  type MatchingStep,
  toScheduleByTrack,
  useMatchingRounds,
} from '@/features/matching-schedule';

const toRound = (step: MatchingStep | null) => {
  if (step?.status === 'ONGOING') return step.round;
  // 모두 끝났으면 마지막 차수, 시작 전 · 일정 없음은 1차
  return step?.status === 'ENDED' ? 3 : 1;
};

// 지원 통계에 보여 줄 매칭 종류와 차수 (프로젝트 목록 기간 계산과 같은 규칙)
// PE 매칭이 진행 중이면 Plan-PE, 아니면 Plan-Design
export const useCurrentMatchingRound = (chapterId: number | null) => {
  const [now] = useState(() => new Date());
  const { data: rounds } = useMatchingRounds(chapterId ?? undefined);
  const schedules = rounds ? toScheduleByTrack(rounds) : null;

  const peStep = schedules && getCurrentMatchingStep(schedules.PLAN_PE.setting, now);
  if (peStep?.status === 'ONGOING') {
    return { type: 'PLAN_DEVELOPER' as MatchingRoundType, round: peStep.round };
  }
  const designStep = schedules && getCurrentMatchingStep(schedules.PLAN_DESIGN.setting, now);
  return { type: 'PLAN_DESIGN' as MatchingRoundType, round: toRound(designStep) };
};
