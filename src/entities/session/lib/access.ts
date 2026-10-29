import type {
  ChapterScope,
  ProjectRegisterAccess,
  ProjectSettingsAccess,
  Role,
  Session,
  View,
} from '../model/types';

const FULL_ACCESS_ROLES: Role[] = ['SUPER_ADMIN', 'HQ_LEAD', 'HQ_ADMIN', 'CHAPTER_ADMIN'];
// 11기 권한표: 학교회장단 · 학교운영진은 프로젝트 설정 접근 불가, PM은 본인 프로젝트 관리만
const BASIC_ACCESS_ROLES: Role[] = ['CHALLENGER_PM'];

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

// 피그마 '합/불 수정 가능 여부 정리': 지원자 배정 상태(합격·불합격·대기)를 바꿀 수 있는 역할
// 매칭 기간 안인지는 차수별로 따로 확인
// - 마스터(SUPER_ADMIN · HQ_LEAD): 전체 / 지부장: 본인 지부 프로젝트만 / 학교 운영진: 조회만
// - PM: 본인 프로젝트만 (PM 뷰에는 본인 프로젝트만 보임)
// TODO: HQ_ADMIN(중앙운영)은 기획 미정이라 우선 조회만
export const canEditApplicantStatus = (
  { role, chapterId }: Pick<Session, 'role' | 'chapterId'>,
  applicationsView: View,
  projectChapterId: string | null, // 프로젝트 소속 지부
): boolean => {
  if (applicationsView === 'PM_CHALLENGER') return true;
  if (applicationsView === 'CHALLENGER') return false;
  if (role === 'SUPER_ADMIN' || role === 'HQ_LEAD') return true;
  if (role === 'CHAPTER_ADMIN') return chapterId !== null && chapterId === projectChapterId;
  return false;
};

// 피그마 전체 매칭 현황 '수동 배정 · 매칭 해제': 마스터(전체 지부) + 지부장(소속 지부)만
// 그 외 뷰에서는 수동 배정하기가 보이지 않고 매칭 결과는 조회만 (최종 결과 발표 뒤에는 따로 막음)
export const canManageMatching = (
  { role, chapterId }: Pick<Session, 'role' | 'chapterId'>,
  view: View,
  projectChapterId: string | null, // 프로젝트 소속 지부
): boolean => {
  if (view !== 'ADMIN') return false;
  if (role === 'SUPER_ADMIN' || role === 'HQ_LEAD') return true;
  if (role === 'CHAPTER_ADMIN') return chapterId !== null && chapterId === projectChapterId;
  return false;
};

// 11기 권한표 '매칭 차수 설정': 볼 수 있는 지부 · 일정을 바꿀 수 있는 지부
// - 마스터(SUPER_ADMIN · HQ_LEAD): 전 지부 설정 · 수정 / 중앙운영진: 전 지부 조회만
// - 지부장: 전 지부 조회, 소속 지부만 설정
// 1차 매칭이 시작됐는지는 따로 확인
export type MatchingScheduleAccess = {
  chapterScope: ChapterScope; // 고를 수 있는 지부
  editScope: ChapterScope | 'NONE'; // 일정을 바꿀 수 있는 지부
};

export const getMatchingScheduleAccess = (role: Role): MatchingScheduleAccess => {
  if (role === 'SUPER_ADMIN' || role === 'HQ_LEAD')
    return { chapterScope: 'ALL', editScope: 'ALL' };
  if (role === 'HQ_ADMIN') return { chapterScope: 'ALL', editScope: 'NONE' };
  if (role === 'CHAPTER_ADMIN') return { chapterScope: 'ALL', editScope: 'OWN' };
  return { chapterScope: 'OWN', editScope: 'NONE' };
};

// 11기 권한표 '지원 현황' (어드민 뷰): 지원자 목록 · 지원서를 볼 수 있는지
// - 마스터 · 지부장: 지원자 목록 조회 · 지원서 열람
// - 중앙운영진: 지원자 목록 조회만 (지원서 열람 불가)
// - 학교회장단 · 학교운영진: 지원 통계만 (지원자 목록 조회 불가)
// 합격 · 불합격 판정은 서버 권한(canDecide)으로 따로 확인
export const getApplicationsAccess = (
  role: Role,
): { canReadApplicants: boolean; canReadApplication: boolean } => {
  if (['SUPER_ADMIN', 'HQ_LEAD', 'CHAPTER_ADMIN'].includes(role)) {
    return { canReadApplicants: true, canReadApplication: true };
  }
  if (role === 'HQ_ADMIN') return { canReadApplicants: true, canReadApplication: false };
  return { canReadApplicants: false, canReadApplication: false };
};

export const getProjectSettingsAccess = (role: Role, view: View): ProjectSettingsAccess => {
  if (view === 'PM_CHALLENGER') return 'BASIC';
  if (view === 'CHALLENGER') return 'NONE';

  if (FULL_ACCESS_ROLES.includes(role)) return 'FULL';
  if (BASIC_ACCESS_ROLES.includes(role)) return 'BASIC';
  return 'NONE';
};

// 프로젝트 등록: 마스터(SUPER_ADMIN · HQ_LEAD)는 전 지부, 지부장은 본인 지부 PM으로 등록하고, PM은 본인 프로젝트를 등록
// 중앙운영(HQ_ADMIN)은 프로젝트 조회만 가능해 등록 · 수정 · 삭제 · 승인이 모두 막힘
export const getProjectRegisterAccess = (role: Role, view: View): ProjectRegisterAccess => {
  const applicationsView = getApplicationsView(role, view);
  if (applicationsView === 'PM_CHALLENGER') return 'PM';
  if (applicationsView === 'CHALLENGER') return 'NONE';
  if (role === 'SUPER_ADMIN' || role === 'HQ_LEAD' || role === 'CHAPTER_ADMIN') return 'ADMIN';
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
