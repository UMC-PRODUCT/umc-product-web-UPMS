import type { ProjectsQuery } from '@/entities/project';
import { toId } from '@/shared/api/toId';

import type { ApplicationFilterValues } from './types';

type Part = NonNullable<ProjectsQuery['parts']>[number];

// 파트 필터(Web · Mobile) → 서버 파트 (PE 플랫폼으로 프로젝트를 거름)
const PART: Record<string, Part> = {
  Web: 'WEB_PRODUCT_ENGINEER',
  Mobile: 'MOBILE_PRODUCT_ENGINEER',
};

const PROJECTS_PER_PAGE = 10;

type ProjectsQueryInput = {
  gisuId: number;
  chapterId: number;
  keyword: string;
  filters: ApplicationFilterValues;
  page: number; // 화면 페이지 (1부터)
};

// 지원자 목록 표의 검색어 · 필터 · 페이지 → 프로젝트 목록 조회 조건
// 차수 필터는 프로젝트가 아니라 지원자를 거르는 조건이라 여기 넣지 않음 (화면에서 지원자만 거름)
export const toProjectsQuery = ({
  gisuId,
  chapterId,
  keyword,
  filters,
  page,
}: ProjectsQueryInput): ProjectsQuery => {
  const trimmed = keyword.trim();
  // 학교 필터 값은 학교 ID 문자열
  const schoolIds = filters.school.flatMap((school) => toId(school) ?? []);
  const parts = filters.part.flatMap((part) => PART[part] ?? []);
  // 모집 상태는 하나만 고름
  const [recruitStatus] = filters.recruitStatus;

  return {
    gisuId,
    chapterId,
    // 매칭 중인 프로젝트는 공개(진행 중) 상태
    statuses: ['IN_PROGRESS'],
    page: page - 1, // 서버는 0부터
    size: PROJECTS_PER_PAGE,
    ...(trimmed && { keyword: trimmed }),
    ...(schoolIds.length > 0 && { schoolIds }),
    ...(parts.length > 0 && { parts }),
    ...(recruitStatus && {
      partQuotaStatus: recruitStatus === 'CLOSED' ? 'COMPLETED' : 'RECRUITING',
    }),
  };
};
