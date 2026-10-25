import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import {
  canEditApplicantStatus,
  canManageMatching,
  getApplicationsView,
  getMatchingScheduleAccess,
  getProjectSettingsAccess,
} from '../lib/access';
import type { Session, View } from './types';

// TODO: 사용자 정보 API가 나오면 실제 데이터로 교체. 지금은 권한별 화면 확인용 mock.
const MOCK_SESSION: Session = { role: 'SUPER_ADMIN', challengerType: null, chapterId: 'axolotl' };

type SessionState = {
  session: Session;
  view: View;
  setSession: (session: Session) => void;
  setView: (view: View) => void;
};

export const useSessionStore = create<SessionState>()((set) => ({
  session: MOCK_SESSION,
  view: 'ADMIN',
  setSession: (session) => set({ session, view: 'ADMIN' }),
  setView: (view) => set({ view }),
}));

export const useProjectSettingsAccess = () =>
  useSessionStore((state) => getProjectSettingsAccess(state.session.role, state.view));

export const useApplicationsView = () =>
  useSessionStore((state) => getApplicationsView(state.session.role, state.view));

// 지원자 배정 상태를 바꿀 수 있는 역할인지 (매칭 기간은 따로 확인)
export const useCanEditApplicantStatus = (projectChapterId: string | null) =>
  useSessionStore((state) =>
    canEditApplicantStatus(
      state.session,
      getApplicationsView(state.session.role, state.view),
      projectChapterId,
    ),
  );

// 매칭 결과를 수동 배정 · 해제할 수 있는 역할인지 (최종 결과 발표 여부는 따로 확인)
export const useCanManageMatching = (projectChapterId: string | null) =>
  useSessionStore((state) => canManageMatching(state.session, state.view, projectChapterId));

// 매칭 차수 설정에서 고를 수 있는 지부 범위 · 일정 수정 가능 여부 (1차 매칭 시작 여부는 따로 확인)
export const useMatchingScheduleAccess = () =>
  useSessionStore(useShallow((state) => getMatchingScheduleAccess(state.session.role)));

// 라우트 beforeLoad처럼 React 밖에서 권한을 확인할 때 사용
export const getProjectSettingsAccessSnapshot = () => {
  const { session, view } = useSessionStore.getState();
  return getProjectSettingsAccess(session.role, view);
};
