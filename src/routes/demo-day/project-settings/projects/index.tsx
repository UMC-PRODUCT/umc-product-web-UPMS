import { createFileRoute } from '@tanstack/react-router';

import ProjectsPage from '../-projects/ProjectsPage';

export const Route = createFileRoute('/demo-day/project-settings/projects/')({
  component: ProjectsPage,
});
