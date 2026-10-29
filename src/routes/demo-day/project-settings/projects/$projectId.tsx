import { createFileRoute } from '@tanstack/react-router';

import ProjectRegisterPage from '../-register/ProjectRegisterPage';

const ProjectEditRoute = () => {
  const navigate = Route.useNavigate();

  return (
    <ProjectRegisterPage
      onComplete={() => navigate({ to: '/demo-day/project-settings/projects' })}
    />
  );
};

export const Route = createFileRoute('/demo-day/project-settings/projects/$projectId')({
  component: ProjectEditRoute,
});
