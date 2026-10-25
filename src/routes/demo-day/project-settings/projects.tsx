import { createFileRoute, redirect } from '@tanstack/react-router';

import { useSessionStore } from '@/entities/session';

import ProjectsPage from './-projects/ProjectsPage';

const ALLOWED_ROLES = ['SUPER_ADMIN', 'HQ_LEAD', 'HQ_ADMIN', 'CHAPTER_ADMIN', 'CHALLENGER_PM'];

export const Route = createFileRoute('/demo-day/project-settings/projects')({
  beforeLoad: () => {
    const { session } = useSessionStore.getState();
    if (!ALLOWED_ROLES.includes(session.role)) {
      throw redirect({ to: '/demo-day/team-matching/notice' });
    }
  },
  component: ProjectsPage,
});
