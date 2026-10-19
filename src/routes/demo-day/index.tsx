import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/demo-day/')({
  beforeLoad: () => {
    throw redirect({ to: '/demo-day/team-matching/notice' });
  },
});
