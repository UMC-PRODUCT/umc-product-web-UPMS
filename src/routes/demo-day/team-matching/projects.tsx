import { createFileRoute } from '@tanstack/react-router';

import ProjectListPage from './-projects/ProjectListPage';

export const Route = createFileRoute('/demo-day/team-matching/projects')({
  component: ProjectListPage,
});
