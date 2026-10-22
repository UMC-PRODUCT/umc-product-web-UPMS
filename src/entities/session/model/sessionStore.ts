import { create } from 'zustand';

import { getApplicationsView, getProjectSettingsAccess } from '../lib/access';
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

// 라우트 beforeLoad처럼 React 밖에서 권한을 확인할 때 사용
export const getProjectSettingsAccessSnapshot = () => {
  const { session, view } = useSessionStore.getState();
  return getProjectSettingsAccess(session.role, view);
};
