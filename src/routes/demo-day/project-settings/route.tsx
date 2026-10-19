import { createFileRoute, redirect } from '@tanstack/react-router';

import { getProjectSettingsAccessSnapshot } from '@/entities/session';

export const Route = createFileRoute('/demo-day/project-settings')({
  beforeLoad: () => {
    if (getProjectSettingsAccessSnapshot() === 'NONE') {
      throw redirect({ to: '/demo-day/team-matching/notice' });
    }
  },
});
