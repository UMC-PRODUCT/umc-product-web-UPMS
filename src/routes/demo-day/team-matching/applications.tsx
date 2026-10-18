import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/demo-day/team-matching/applications')({
  component: () => <h1 className="p-8 text-3xl font-bold">내 지원 현황</h1>,
});
