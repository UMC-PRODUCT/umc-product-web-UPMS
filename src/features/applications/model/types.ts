import type { MatchingResult } from '@/shared/ui/MatchingResultTag';

export type RecruitStatus = 'RECRUITING' | 'CLOSED';

export type RecruitPart = 'DESIGN' | 'WEB_PE' | 'MOBILE_PE';

// 프로젝트 서비스 플랫폼. PE는 플랫폼에 맞는 파트만 모집
export type ServicePlatform = 'WEB' | 'MOBILE';

// 파트별 지원 인원 / 모집 인원과 모집 상태
export type PartRecruitment = {
  part: RecruitPart;
  applied: number;
  capacity: number;
  status: RecruitStatus;
};

// 내 지원 목록의 카드 한 장 (지원서 1건). 소개 · 로고는 목록 API에 없어서 상세 모달에서 프로젝트 상세로 불러옴
export type AppliedProject = {
  applicationId: number | null; // 랜덤 매칭으로 확정된 카드는 지원서가 없어서 null
  projectId: number;
  projectName: string;
  thumbnailUrl: string | null; // 없으면 회색 칸
  pmName: string; // 닉네임/이름
  schoolName: string;
  platform: ServicePlatform;
  recruitments: PartRecruitment[]; // 모집하는 파트만
  applicationEditable: boolean; // 지원 기간이면 true (지원 취소 · 수정 가능)
  // 매칭 결과 발표 시각에 일괄 공개. 발표 전이면 null (지난 차수 결과는 항상 표시)
  result: MatchingResult | null;
};

// 지원서 답변: 글 / 보기 선택 / 첨부(링크 · PDF)
export type ApplicationAnswer =
  | { type: 'TEXT'; text: string }
  | {
      type: 'CHOICE';
      multiple: boolean;
      options: { value: string; label: string }[];
      selected: string[];
    }
  | { type: 'ATTACHMENT'; label: string; href?: string };

export type ApplicationQuestion = {
  questionId: string;
  number: string; // 예: 01
  title: string;
  required: boolean;
  answer: ApplicationAnswer;
};

// 문항 묶음 (공통 문항, 파트별 문항)
export type ApplicationSection = {
  sectionId: string;
  title: string;
  questions: ApplicationQuestion[];
};

// 일반 차수(1~3차)는 합격 · 불합격을 발표하고, 랜덤 매칭은 발표하지 않음
export type MatchingType = 'REGULAR' | 'RANDOM';

// 매칭 차수 한 묶음 (예: Plan-Design 1차 매칭)
export type AppliedRoundGroup = {
  roundId: string;
  roundName: string;
  matchingType: MatchingType;
  projects: AppliedProject[];
};
