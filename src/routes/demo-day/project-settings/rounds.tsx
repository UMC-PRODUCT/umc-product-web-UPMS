import { createFileRoute, redirect } from '@tanstack/react-router';

import { getProjectSettingsAccessSnapshot } from '@/entities/session';
import FixedWidthPage from '@/shared/ui/FixedWidthPage';

import MatchingRoundsPage from './-rounds/MatchingRoundsPage';

export const Route = createFileRoute('/demo-day/project-settings/rounds')({
  beforeLoad: () => {
    if (getProjectSettingsAccessSnapshot() !== 'FULL') {
      throw redirect({ to: '/demo-day/team-matching/notice' });
    }
  },
  component: () => (
    <FixedWidthPage>
      <MatchingRoundsPage />
    </FixedWidthPage>
  ),
});
