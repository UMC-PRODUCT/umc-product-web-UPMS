import { api } from '@/shared/api/client';

// 서버가 int64를 문자열로 줌 (숫자 · 문자열 모두 받아 변환 함수에서 숫자로 맞춤)
type Int64 = string | number;

type MatchingRoundBrief = {
  matchingRoundId?: Int64;
  type?: 'PLAN_DESIGN' | 'PLAN_DEVELOPER';
  phase?: 'FIRST' | 'SECOND' | 'THIRD' | 'RANDOM_MATCHING';
};

type PhaseCount = { phase?: MatchingRoundBrief['phase']; applicantCount?: Int64 };

// 받아 둔 OpenAPI 문서에 아직 없는 API라 개발 서버 실제 응답을 기준으로 정의
// TODO: 최신 OpenAPI 문서를 받으면 생성 타입(operations)으로 교체
export type ApplicationStatisticsResponse = {
  chapterId?: Int64;
  matchingRound?: MatchingRoundBrief | null; // 지금 진행 중인 매칭 차수 (서버 기준)
  summary?: {
    // 차수별 지원 완료 인원 / 지원 가능 인원
    roundApplicationStatistics?: {
      matchingRound?: MatchingRoundBrief;
      appliedMemberCount?: Int64;
      availableMemberCount?: Int64;
    }[];
    // 학교별 지원 가능 총원 + 차수별 지원자 수
    schoolApplicationStatistics?: {
      schoolId?: Int64;
      schoolName?: string;
      totalMemberCount?: Int64;
      rounds?: PhaseCount[];
    }[];
    // 프로젝트별 차수 지원자 수
    projectRoundStatistics?: {
      projectId?: Int64;
      projectName?: string;
      rounds?: PhaseCount[];
    }[];
  };
};

// 지부 전체(chapterId) 또는 프로젝트(projectIds) 중 하나로 조회
export type ApplicationStatisticsQuery = { chapterId: number } | { projectIds: number[] };

/** 프로젝트 지원 현황 통계 (기존 GET /api/v1/projects/statistics 는 deprecated) */
export const getApplicationStatistics = (query: ApplicationStatisticsQuery) =>
  api.get<ApplicationStatisticsResponse>(
    '/api/v1/projects/statistics/applications',
    'chapterId' in query
      ? { chapterId: query.chapterId }
      : // axios 기본값은 배열을 projectIds[]=1&projectIds[]=2로 보내서 서버가 못 읽음. 쉼표로 이어 보냄
        { projectIds: query.projectIds.join(',') },
  );
