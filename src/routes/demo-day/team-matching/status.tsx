import { createFileRoute } from '@tanstack/react-router';

import FixedWidthPage from '@/shared/ui/FixedWidthPage';

import MatchingStatusPage from './-status/MatchingStatusPage';

export const Route = createFileRoute('/demo-day/team-matching/status')({
  component: () => (
    <FixedWidthPage>
      <MatchingStatusPage />
    </FixedWidthPage>
  ),
});
