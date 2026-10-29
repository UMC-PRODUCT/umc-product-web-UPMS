import type { PartTagPart } from '@umc-product/react';

export type RecruitStatus = 'RECRUITING' | 'CLOSED';

export type RecruitPart = 'DESIGN' | 'WEB_PE' | 'MOBILE_PE';

// 파트별 지원 인원 / 모집 인원
export type PartRecruitment = {
  applied: number;
  capacity: number;
};

// PE는 Web, Mobile 중 하나만 모집할 수 있어 나머지 하나는 null
export type PartRecruitments = { DESIGN: PartRecruitment } & (
  { WEB_PE: PartRecruitment; MOBILE_PE: null } | { WEB_PE: null; MOBILE_PE: PartRecruitment }
);

export type ProjectApplicationRow = {
  projectId: number;
  projectName: string;
  part: PartTagPart;
  challengerName: string; // 닉네임/이름
  schoolName: string;
  recruitStatus: RecruitStatus;
  recruitments: PartRecruitments;
};

// 프로젝트를 함께 맡은 다른 PM (더블 PM)
export type ProjectCoPm = {
  challengerName: string; // 닉네임/이름
  schoolName: string;
};

export type ApplicantStatus = 'PASSED' | 'WAITING' | 'FAILED';

export type Applicant = {
  applicantId: string; // 목록 key · 선택 상태용 (지원서 ID를 문자열로)
  applicationId: number; // 지원서 상세 · 배정 상태 변경 API에 씀
  matchingRoundId: number | null; // 지원한 매칭 차수 (결정 기간인지 확인용)
  memberId: number | null; // 지원자 회원 ID (매칭 결과 시트의 팀원과 지원서를 잇는 데 씀)
  round: 1 | 2 | 3;
  part: PartTagPart;
  challengerName: string; // 닉네임/이름
  schoolName: string;
  status: ApplicantStatus;
  appliedAt: string; // ISO 시각
  // 처리 시각: 합격·불합격은 결과를 정한 시각, 대기는 마지막으로 대기를 누른 시각
  processedAt: string | null; // 상태를 한 번도 누르지 않았으면 null → "-"
};

// 테이블 한 묶음: 프로젝트 줄 + (더블 PM 줄) + 지원자 줄들
export type ProjectApplicationGroup = {
  project: ProjectApplicationRow;
  coPms: ProjectCoPm[]; // PM이 한 명이면 빈 배열
  applicants: Applicant[];
};

export type ApplicationFilterKey = 'school' | 'part' | 'round' | 'recruitStatus';

export type ApplicationFilterValues = Record<ApplicationFilterKey, string[]>; // 빈 배열이면 전체
