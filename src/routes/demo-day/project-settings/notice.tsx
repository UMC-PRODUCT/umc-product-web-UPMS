import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/demo-day/project-settings/notice')({
  component: () => <h1 className="p-8 text-3xl font-bold">공지 (프로젝트 설정)</h1>,
});
