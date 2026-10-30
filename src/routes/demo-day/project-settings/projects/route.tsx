import { createFileRoute, redirect } from '@tanstack/react-router';

import { useSessionStore } from '@/entities/session';

export const Route = createFileRoute('/demo-day/project-settings/projects')({
  beforeLoad: () => {
    const { session } = useSessionStore.getState();
    if (session.role === 'SCHOOL_ADMIN' || session.role === 'SCHOOL_STAFF') {
      throw redirect({ to: '/demo-day/team-matching/notice' });
    }
  },
});
