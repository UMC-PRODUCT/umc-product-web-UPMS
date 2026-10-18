import { createFileRoute, redirect } from '@tanstack/react-router';

import { getProjectSettingsAccessSnapshot } from '@/entities/session';

export const Route = createFileRoute('/demo-day/project-settings/quota')({
  beforeLoad: () => {
    if (getProjectSettingsAccessSnapshot() !== 'FULL') {
      throw redirect({ to: '/demo-day/team-matching/notice' });
    }
  },
  component: () => <h1 className="p-8 text-3xl font-bold">프로젝트 TO 관리</h1>,
});
