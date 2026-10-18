export type Role =
  | 'SUPER_ADMIN' // 최고 관리자 / 프로덕트 계정
  | 'HQ_LEAD' // 총괄/부총괄
  | 'HQ_ADMIN' // 중앙운영/교육국
  | 'CHAPTER_ADMIN' // 지부장
  | 'SCHOOL_ADMIN' // 교내 회장/부회장
  | 'SCHOOL_STAFF' // 교내 기타 운영진
  | 'CHALLENGER_PM'
  | 'CHALLENGER'; // 일반 챌린저

// 운영진이면서 이번 기수 챌린저로도 활동하는 경우의 챌린저 유형
export type ChallengerType = 'PM' | 'GENERAL';

export type Session = {
  role: Role;
  challengerType: ChallengerType | null;
};

export type View = 'ADMIN' | 'PM_CHALLENGER' | 'CHALLENGER';

// 사이드바 '프로젝트 설정' 메뉴 접근 수준
export type ProjectSettingsAccess = 'FULL' | 'BASIC' | 'NONE';
