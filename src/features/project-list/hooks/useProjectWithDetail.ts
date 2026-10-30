import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { toId } from '@/shared/api/toId';

import { getProjectDetail } from '../api/getProjectDetail';
import { getProjectMembers } from '../api/getProjectMembers';
import { applyProjectDetail } from '../lib/toProject';
import type { Project } from '../model/types';

// 상세 모달이 열린 프로젝트에 로고 · 기획 링크 · 팀원 구성을 덧붙임 (목록 응답에는 없음)
// 프로젝트가 null이면(모달이 닫혀 있으면) 부르지 않음
export const useProjectWithDetail = (project: Project | null): Project | null => {
  const projectId = project ? toId(project.projectId) : null;

  const { data: detail } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectDetail(projectId as number),
    enabled: projectId !== null,
  });
  const { data: teamMembers } = useQuery({
    queryKey: ['project-members', projectId],
    queryFn: () => getProjectMembers(projectId as number),
    enabled: projectId !== null,
  });

  return useMemo(
    () => (project ? applyProjectDetail(project, detail, teamMembers) : null),
    [project, detail, teamMembers],
  );
};
