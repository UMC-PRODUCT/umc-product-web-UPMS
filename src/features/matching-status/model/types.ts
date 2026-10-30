// 지부 프로젝트 매칭률: 지부 전체 모집 인원(TO) 중 차수별 매칭 인원
export type ChapterMatchingRate = {
  totalCapacity: number; // 지부 전체 모집 인원
  rounds: {
    round: 1 | 2 | 3;
    matched: number | null; // 아직 진행 전이면 null
    capacity: number | null; // 해당 차수 남은 모집 인원, 이전 차수가 끝나지 않았으면 null
  }[];
};

// 학교별 매칭 인원 / 학교 전체 인원
export type SchoolMatching = {
  schoolName: string;
  matched: number | null; // 아직 집계 전이면 null → "- 명"
  total: number;
};

// 1 · 2 · 3차는 PM이 직접 심사, 남은 인원은 랜덤 매칭
export type RoundMatchingKey = 1 | 2 | 3 | 'RANDOM';

// 차수별 매칭 인원
export type RoundMatching = {
  round: RoundMatchingKey;
  matched: number | null; // 아직 진행 전이면 null
};

// 매칭 결과 시트: 파트 자리에 매칭된 챌린저
export type MatchedMember = {
  memberId: number;
  challengerName: string; // 닉네임/이름
  schoolName: string;
  round: RoundMatchingKey; // 매칭된 차수 (지원 없이 수동 배정됐으면 랜덤 매칭과 같이 R)
  // ISO 시각 (매칭 해제 확인창 "MM월 DD일 HH시에 매칭된 챌린저예요"). API에 없으면 null
  // TODO: 백엔드에 팀원 구성 응답의 매칭 시각 · 지원서 제출 시각 추가 요청
  matchedAt: string | null;
  submittedAt: string | null; // 지원서 제출 시각, 모르거나 지원 없이 수동 배정됐으면 null
};

// 모집 파트 (PE는 서비스 플랫폼에 따라 Web 또는 Mobile)
export type MatchingPart = 'DESIGN' | 'WEB_PE' | 'MOBILE_PE';

// 매칭 결과 시트: 파트별 모집 인원과 매칭된 챌린저 (모집 인원보다 적으면 남은 자리는 빈 칸)
export type PartMatching = {
  part: MatchingPart;
  partLabel: string; // 예: Design, Web, Mobile
  capacity: number;
  members: MatchedMember[];
};

// 매칭 결과 시트의 프로젝트 한 줄
export type ProjectMatchingResult = {
  projectId: number;
  projectName: string;
  pmName: string; // 닉네임/이름
  pmSchoolName: string;
  recruiting: boolean; // 매칭 진행 중이면 "모집 중" 태그 + "매칭 인원/모집 인원"
  parts: PartMatching[];
};

// 서비스 플랫폼별 매칭 결과 시트
export type PlatformMatchingResults = {
  platform: 'WEB' | 'MOBILE';
  projects: ProjectMatchingResult[];
};

// 프로젝트별 차수 매칭 인원 (프로젝트별 매칭 현황 차트)
export type ProjectMatchings = {
  projectName: string;
  counts: Record<1 | 2 | 3, number>;
  // 툴팁: 파트별 매칭 인원 / 모집 인원 (모집하는 파트만)
  parts: { part: MatchingPart; matched: number; capacity: number }[];
};

// 팀원 수동 배정: 아직 어느 프로젝트에도 배정되지 않은 챌린저
export type UnassignedChallenger = {
  memberId: number; // 수동 배정 API에 보냄
  challengerName: string; // 닉네임/이름
  schoolName: string;
  part: MatchingPart;
};
