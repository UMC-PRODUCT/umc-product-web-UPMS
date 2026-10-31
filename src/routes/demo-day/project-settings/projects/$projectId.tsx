import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import ProjectRegisterPage from '../-register/ProjectRegisterPage';

const ProjectEditRoute = () => {
  const navigate = Route.useNavigate();
  const { projectId } = Route.useParams();
  const queryClient = useQueryClient();

  return (
    <ProjectRegisterPage
      projectId={Number(projectId)}
      onComplete={() => {
        queryClient.invalidateQueries({ queryKey: ['managed-projects'] });
        navigate({ to: '/demo-day/project-settings/projects' });
      }}
    />
  );
};

export const Route = createFileRoute('/demo-day/project-settings/projects/$projectId')({
  component: ProjectEditRoute,
});
