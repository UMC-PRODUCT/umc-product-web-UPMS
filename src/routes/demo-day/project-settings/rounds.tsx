import { createFileRoute, redirect } from '@tanstack/react-router';

import { getProjectSettingsAccessSnapshot } from '@/entities/session';

export const Route = createFileRoute('/demo-day/project-settings/rounds')({
  beforeLoad: () => {
    if (getProjectSettingsAccessSnapshot() !== 'FULL') {
      throw redirect({ to: '/demo-day/team-matching/notice' });
    }
  },
  component: () => <h1 className="p-8 text-3xl font-bold">매칭 차수 관리</h1>,
});
