export type MatchingRound = 1 | 2 | 3;

export type RoundApplication = {
  round: MatchingRound;
  applied: number | null; // 아직 열리지 않은 차수는 null → "- 명" 표시
  matched: number | null; // 해당 차수 매칭 인원, 매칭 전이면 null
};

export type RoundProgress = {
  currentRound: MatchingRound;
  eligibleCount: number; // 1차 기준 전체 지원 가능 인원
  rounds: RoundApplication[];
};

// 화면 표시용: 이전 차수 매칭 인원을 뺀 차수별 지원 가능 인원
export type RoundApplicationStat = {
  round: MatchingRound;
  applied: number | null;
  eligible: number | null; // 이전 차수 매칭이 끝나지 않았으면 null → "- 명" 표시
};

// 학교별 차수 진행 데이터 (지원 가능 인원 계산 규칙은 RoundProgress와 같음)
export type SchoolApplicants = {
  schoolName: string;
  eligibleCount: number; // 1차 기준 학교 전체 지원 가능 인원
  rounds: RoundApplication[];
};

// 화면 표시용: 현재 차수 기준 "지원 인원 / 지원 가능 인원"
export type SchoolApplicantStat = {
  schoolName: string;
  applied: number | null;
  eligible: number | null;
};

export type ProjectApplications = {
  projectName: string;
  counts: Record<MatchingRound, number>; // 차수별 지원 인원
};

export type TotalApplicants = {
  currentRound: MatchingRound;
  schools: SchoolApplicants[];
};

export type MyProject = {
  projectName: string;
  logoUrl: string | null; // 로고가 없으면 빈 썸네일
  pmName: string; // 닉네임/이름
  schoolName: string;
};
