export type RecruitPart = 'DESIGN' | 'WEB_PE' | 'MOBILE_PE';

export type RecruitStatus = 'RECRUITING' | 'CLOSED';

// 프로젝트 서비스 플랫폼. PE는 플랫폼에 맞는 파트만 모집
export type ServicePlatform = 'WEB' | 'MOBILE';

// 매칭된 차수. 랜덤 매칭은 R로 표기
export type TeamMemberRound = 1 | 2 | 3 | 'RANDOM';

export type TeamMember = {
  memberId: string;
  challengerName: string; // 닉네임/이름
  schoolName: string;
  round: TeamMemberRound;
};

export type PartRecruitment = {
  part: RecruitPart;
  applied: number; // 지원 인원
  capacity: number; // 모집 인원
  status: RecruitStatus;
  members: TeamMember[]; // 매칭된 팀원 (매칭 전이면 빈 배열)
};

export type Project = {
  projectId: string;
  projectName: string;
  logoUrl: string | null; // 없으면 기본 로고
  thumbnailUrl: string | null; // 없으면 회색 칸
  pmName: string; // 닉네임/이름
  schoolName: string;
  chapterId: string; // 프로젝트 소속 지부
  description: string; // 200자 이내, 말줄임 없이 전문 표시
  platform: ServicePlatform;
  planUrl: string | null; // 기획 문서 링크
  recruitments: PartRecruitment[]; // Design + 서비스 플랫폼의 PE만
};

// 지원 기간: 챌린저가 프로젝트에 지원 / 매칭 기간: 운영진이 지원자를 매칭 (지원 불가)
export type ProjectPeriodPhase = 'APPLY' | 'MATCHING';

export type ProjectPeriod = {
  track: 'DESIGN' | 'PE'; // 진행 중인 매칭 트랙 (Plan-Design / Plan-PE)
  phase: ProjectPeriodPhase;
  round: 1 | 2 | 3; // 진행 중인 매칭 차수
};

// 로그인한 사용자가 프로젝트와 맺은 관계 (버튼 구성에 쓰임)
export type ProjectViewer = {
  challengerPart: RecruitPart | null; // 챌린저의 지원 파트. 운영진은 null
  myProjectId: string | null; // PM이 맡은 프로젝트
  appliedProjectId: string | null; // 이번 차수에 지원한 프로젝트
  isMatched: boolean; // 이미 매칭됨 (합격자 · 랜덤 매칭 배정자)
};

export type ProjectFilterKey = 'chapter' | 'school' | 'part' | 'recruitStatus';

// 빈 배열 = 선택 없음 (전체)
export type ProjectFilterValues = Record<ProjectFilterKey, string[]>;
