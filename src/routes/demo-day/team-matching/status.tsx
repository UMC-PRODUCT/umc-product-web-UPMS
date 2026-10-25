import { createFileRoute } from '@tanstack/react-router';

import MatchingStatusPage from './-status/MatchingStatusPage';

export const Route = createFileRoute('/demo-day/team-matching/status')({
  component: MatchingStatusPage,
});
