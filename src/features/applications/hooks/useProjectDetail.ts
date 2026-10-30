import { skipToken, useQuery } from '@tanstack/react-query';

import { getProjectDetail } from '../api/getProjectDetail';
import { projectKeys } from '../api/queryKeys';

// 목록 API에 없는 프로젝트 소개 · 로고 · 기획 링크 · 보조 PM. projectId가 null이면(모달이 닫혀 있으면) 부르지 않음
// (챌린저 상세 모달, PM 내 프로젝트 탭 · 보조 PM 줄)
export const useProjectDetail = (projectId: number | null) =>
  useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: projectId === null ? skipToken : () => getProjectDetail(projectId),
    select: ({ description, logoImageUrl, externalLink, coProductOwners = [] }) => ({
      description: description ?? '',
      logoUrl: logoImageUrl || null,
      planUrl: externalLink || null, // 기획 보기 링크 (없으면 null)
      coPms: coProductOwners.map(({ nickname, name, schoolName }) => ({
        challengerName: [nickname, name].filter(Boolean).join('/'),
        schoolName: schoolName ?? '',
      })),
    }),
  });
