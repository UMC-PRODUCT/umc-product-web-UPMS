import type { ProjectSettingsAccess, Role, Session, View } from '../model/types';

const FULL_ACCESS_ROLES: Role[] = ['SUPER_ADMIN', 'HQ_LEAD', 'HQ_ADMIN', 'CHAPTER_ADMIN'];
const BASIC_ACCESS_ROLES: Role[] = ['SCHOOL_ADMIN', 'SCHOOL_STAFF', 'CHALLENGER_PM'];

// 챌린저를 겸할 수 있는 운영진. challengerType이 있으면 뷰 전환이 생긴다.
const VIEW_SWITCHABLE_ROLES: Role[] = ['HQ_ADMIN', 'CHAPTER_ADMIN', 'SCHOOL_ADMIN', 'SCHOOL_STAFF'];

export type ViewOption = { value: View; label: string };

export const getViewOptions = ({ role, challengerType }: Session): ViewOption[] => {
  // 슈퍼 어드민은 QA를 위해 모든 뷰에 접근 가능
  if (role === 'SUPER_ADMIN') {
    return [
      { value: 'ADMIN', label: 'Admin View' },
      { value: 'PM_CHALLENGER', label: 'PM Challenger View' },
      { value: 'CHALLENGER', label: 'Challenger View' },
    ];
  }

  if (VIEW_SWITCHABLE_ROLES.includes(role) && challengerType) {
    return [
      { value: 'ADMIN', label: 'Admin View' },
      {
        value: challengerType === 'PM' ? 'PM_CHALLENGER' : 'CHALLENGER',
        label: 'Challenger View',
      },
    ];
  }

  return [];
};

export const getProjectSettingsAccess = (role: Role, view: View): ProjectSettingsAccess => {
  if (view === 'PM_CHALLENGER') return 'BASIC';
  if (view === 'CHALLENGER') return 'NONE';

  if (FULL_ACCESS_ROLES.includes(role)) return 'FULL';
  if (BASIC_ACCESS_ROLES.includes(role)) return 'BASIC';
  return 'NONE';
};
