import { createFileRoute, redirect } from '@tanstack/react-router';

import { getProjectRegisterAccessSnapshot } from '@/entities/session';

import ProjectRegisterPage from '../-register/ProjectRegisterPage';

const ProjectRegisterRoute = () => {
  const navigate = Route.useNavigate();

  return (
    <ProjectRegisterPage
      onComplete={() => navigate({ to: '/demo-day/project-settings/projects' })}
    />
  );
};

export const Route = createFileRoute('/demo-day/project-settings/projects/new')({
  // 중앙운영(HQ_ADMIN) 등 등록 권한이 없으면 프로젝트 관리 목록으로 돌려보낸다
  beforeLoad: () => {
    if (getProjectRegisterAccessSnapshot() === 'NONE') {
      throw redirect({ to: '/demo-day/project-settings/projects' });
    }
  },
  component: ProjectRegisterRoute,
});
