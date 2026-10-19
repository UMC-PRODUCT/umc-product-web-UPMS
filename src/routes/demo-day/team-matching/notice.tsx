import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/demo-day/team-matching/notice')({
  component: () => <h1 className="p-8 text-3xl font-bold">공지</h1>,
});
