import { createFileRoute, redirect } from '@tanstack/react-router';

import { getProjectSettingsAccessSnapshot } from '@/entities/session';

import QuotaPage from './-quota/QuotaPage';

export const Route = createFileRoute('/demo-day/project-settings/quota')({
  beforeLoad: () => {
    if (getProjectSettingsAccessSnapshot() !== 'FULL') {
      throw redirect({ to: '/demo-day/team-matching/notice' });
    }
  },
  component: QuotaPage,
});
