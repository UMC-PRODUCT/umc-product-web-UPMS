import { useState } from 'react';

import type { Session, View } from '@/entities/session';
import { getCurrentMatchingStep, MOCK_MATCHING_SCHEDULES } from '@/features/matching-schedule';
import type { ProjectPeriod, ProjectViewer } from '@/features/project-list';

type Track = ProjectPeriod['track'];

const FALLBACK_CHAPTER_ID = 'otter';

// 일반 챌린저는 본인 파트의 트랙 일정을 따름 (Design → Plan-Design, PE → Plan-PE)
const getChallengerTrack = ({ challengerPart }: ProjectViewer): Track | null => {
  if (challengerPart === null) return null;
  return challengerPart === 'DESIGN' ? 'DESIGN' : 'PE';
};

// 지금 시각과 소속 지부의 매칭 일정으로 프로젝트 목록 화면이 따를 기간을 계산
// - 챌린저는 본인 트랙, 운영진 · PM은 PE 매칭이 진행 중이면 PE, 아니면 Design 트랙을 따름
// - 시작 전 · 모두 끝남 · 일정 없음은 지원할 수 없는 매칭 기간으로 취급
// TODO: 지부별 매칭 일정 API 연동 (지금은 MOCK_MATCHING_SCHEDULES와 현재 시각으로 계산)
export const useProjectPeriod = (
  session: Pick<Session, 'chapterId'>,
  view: View,
  viewer: ProjectViewer,
): ProjectPeriod => {
  const [now] = useState(() => new Date());
  const schedules = MOCK_MATCHING_SCHEDULES[session.chapterId ?? FALLBACK_CHAPTER_ID];

  const stepOf = (track: Track) =>
    schedules
      ? getCurrentMatchingStep(track === 'DESIGN' ? schedules.PLAN_DESIGN : schedules.PLAN_PE, now)
      : null;

  const isOngoing = (track: Track) => stepOf(track)?.status === 'ONGOING';

  const track: Track =
    (view === 'CHALLENGER' ? getChallengerTrack(viewer) : null) ??
    (isOngoing('PE') ? 'PE' : 'DESIGN');

  const step = stepOf(track);
  if (step?.status === 'ONGOING') return { track, phase: step.phase, round: step.round };
  return { track, phase: 'MATCHING', round: step?.status === 'ENDED' ? 3 : 1 };
};
