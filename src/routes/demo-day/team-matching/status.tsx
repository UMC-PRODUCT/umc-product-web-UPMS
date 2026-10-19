import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/demo-day/team-matching/status')({
  component: () => <h1 className="p-8 text-3xl font-bold">전체 매칭 현황</h1>,
});
