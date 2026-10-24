import type { ChapterScope, ProjectSettingsAccess, Role, Session, View } from '../model/types';

const FULL_ACCESS_ROLES: Role[] = ['SUPER_ADMIN', 'HQ_LEAD', 'HQ_ADMIN', 'CHAPTER_ADMIN'];
const BASIC_ACCESS_ROLES: Role[] = ['SCHOOL_ADMIN', 'SCHOOL_STAFF', 'CHALLENGER_PM'];

// 챌린저를 겸할 수 있는 운영진. challengerType이 있으면 뷰 전환이 생긴다.
const VIEW_SWITCHABLE_ROLES: Role[] = ['HQ_ADMIN', 'CHAPTER_ADMIN', 'SCHOOL_ADMIN', 'SCHOOL_STAFF'];

export type ViewOption = { value: View; label: string };

export const getViewOptions = ({
  role,
  challengerType,
}: Pick<Session, 'role' | 'challengerType'>): ViewOption[] => {
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

const CHALLENGER_ROLES: Role[] = ['CHALLENGER_PM', 'CHALLENGER'];

// 마스터·중앙운영진은 전 지부, 지부장·학교 운영진은 소속 지부만 조회
const ALL_CHAPTER_ROLES: Role[] = ['SUPER_ADMIN', 'HQ_LEAD', 'HQ_ADMIN'];

export const getChapterScope = (role: Role): ChapterScope =>
  ALL_CHAPTER_ROLES.includes(role) ? 'ALL' : 'OWN';

// 지원 현황 페이지에서 보여줄 화면. 운영진은 선택한 뷰를, 챌린저는 자기 유형의 화면을 본다.
export const getApplicationsView = (role: Role, view: View): View => {
  if (view !== 'ADMIN') return view;
  if (role === 'CHALLENGER_PM') return 'PM_CHALLENGER';
  if (CHALLENGER_ROLES.includes(role)) return 'CHALLENGER';
  return 'ADMIN';
};

export const getProjectSettingsAccess = (role: Role, view: View): ProjectSettingsAccess => {
  if (view === 'PM_CHALLENGER') return 'BASIC';
  if (view === 'CHALLENGER') return 'NONE';

  if (FULL_ACCESS_ROLES.includes(role)) return 'FULL';
  if (BASIC_ACCESS_ROLES.includes(role)) return 'BASIC';
  return 'NONE';
};

// 공지 작성·수정·삭제 권한. 총괄단은 전 지부, 지부장은 본인 지부만, 학교 운영진 등은 불가.
export const canManageNotice = (
  role: Role,
  ownChapterId: string | null,
  targetChapterId: string,
): boolean => {
  if (ALL_CHAPTER_ROLES.includes(role)) return true;
  return role === 'CHAPTER_ADMIN' && ownChapterId === targetChapterId;
};
