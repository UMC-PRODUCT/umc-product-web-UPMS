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
  // TODO: 지원 현황 · 매칭 현황 · 공지 화면이 서버 지부를 쓰게 되면 serverChapterId로 통합
  chapterId: string | null; // 소속 지부 (mock 지부 ID, 아직 mock 데이터를 쓰는 화면용)
  serverChapterId: number | null; // 소속 지부 (서버 지부 ID)
  gisuId: number | null; // 현재 활성 기수 (지부 목록 등 기수별 조회에 씀)
};

export type View = 'ADMIN' | 'PM_CHALLENGER' | 'CHALLENGER';

// 사이드바 '프로젝트 설정' 메뉴 접근 수준
export type ProjectSettingsAccess = 'FULL' | 'BASIC' | 'NONE';

// 프로젝트 등록 페이지 접근 수준. ADMIN: 마스터 · 지부장(PM을 골라 등록) / PM: 본인 프로젝트 등록 / NONE: 접근 불가
export type ProjectRegisterAccess = 'ADMIN' | 'PM' | 'NONE';

// 지원 현황에서 조회할 수 있는 지부 범위
export type ChapterScope = 'ALL' | 'OWN';
