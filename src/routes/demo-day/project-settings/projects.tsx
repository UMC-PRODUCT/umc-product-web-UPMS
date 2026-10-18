import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/demo-day/project-settings/projects')({
  component: () => <h1 className="p-8 text-3xl font-bold">프로젝트 관리</h1>,
});
