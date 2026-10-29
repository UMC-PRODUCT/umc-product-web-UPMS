// PE는 서비스 플랫폼에 맞는 파트만 모집 (Web PE / Mobile PE)
export type PePlatform = 'WEB' | 'MOBILE';

export type QuestionType = 'SHORT' | 'LONG' | 'SINGLE' | 'MULTIPLE' | 'FILE' | 'PORTFOLIO';

export type QuestionSectionKey = 'COMMON' | 'DESIGN' | 'PE';

export type QuestionChoice = { id: string; label: string };

export type ProjectQuestion = {
  id: string;
  type: QuestionType;
  title: string;
  description: string;
  required: boolean;
  choices: QuestionChoice[]; // 단일 · 복수 선택일 때만 사용
};

// 모집 정보(2단계): 지부장 이상 운영진이 입력하고, PM은 조회만 함
export type RecruitInfo = {
  designCount: number;
  peCount: number;
  pePlatform: PePlatform | null;
};

export type ProjectDraft = {
  thumbnail: File | null; // 프로젝트 카드 썸네일 (648*324, 2:1)
  logo: File | null;
  // 이어 쓰는 초안은 파일이 아니라 서버에 저장된 이미지 주소만 있음. 새로 고르면 파일이 우선
  thumbnailUrl: string;
  logoUrl: string;
  name: string;
  description: string;
  planUrl: string;
  pmIds: string[]; // 운영진이 고른 PM. PM 본인이 등록할 때는 본인으로 정해져 쓰이지 않음
  recruit: RecruitInfo;
  questions: Record<QuestionSectionKey, ProjectQuestion[]>;
  // 공통 문항은 항상 사용. Design · PE 섹션만 켜고 끔
  sectionEnabled: Record<Exclude<QuestionSectionKey, 'COMMON'>, boolean>;
};

export type PmCandidate = {
  id: string;
  nickname: string;
  name: string;
  schoolName: string;
};
