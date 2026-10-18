import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/demo-day/team-matching/projects')({
  component: () => <h1 className="p-8 text-3xl font-bold">프로젝트 목록</h1>,
});
