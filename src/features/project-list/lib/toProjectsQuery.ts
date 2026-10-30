import { toId } from '@/shared/api/toId';

import type { ProjectsQuery } from '../api/getProjects';
import type { ProjectFilterValues } from '../model/types';

// 피그마 필터의 파트(서비스 플랫폼) → 서버 파트. Design은 필터에 없음
const PART_FILTER: Record<string, NonNullable<ProjectsQuery['parts']>[number]> = {
  Web: 'WEB_PRODUCT_ENGINEER',
  Mobile: 'MOBILE_PRODUCT_ENGINEER',
};

export const PROJECTS_PER_PAGE = 12;

type Params = {
  gisuId: number;
  keyword: string;
  filters: ProjectFilterValues;
  page: number; // 화면은 1부터
};

// 화면 필터 → 목록 조회 쿼리. 서버 페이지는 0부터
// 등록 완료(진행 중 · 완료) 프로젝트만 보여줌. 임시저장 · 승인 대기는 목록에 나오지 않음
export const toProjectsQuery = ({ gisuId, keyword, filters, page }: Params): ProjectsQuery => {
  const chapterId = toId(filters.chapter[0]);
  const schoolIds = filters.school.flatMap((school) => toId(school) ?? []);
  const parts = filters.part.flatMap((part) => PART_FILTER[part] ?? []);
  const recruitStatus = filters.recruitStatus[0];

  return {
    gisuId,
    keyword: keyword.trim() || undefined,
    chapterId: chapterId ?? undefined,
    schoolIds: schoolIds.length > 0 ? schoolIds : undefined,
    parts: parts.length > 0 ? parts : undefined,
    partQuotaStatus:
      recruitStatus === 'RECRUITING'
        ? 'RECRUITING'
        : recruitStatus === 'CLOSED'
          ? 'COMPLETED'
          : undefined,
    statuses: ['IN_PROGRESS', 'COMPLETED'],
    page: page - 1,
    size: PROJECTS_PER_PAGE,
  };
};
