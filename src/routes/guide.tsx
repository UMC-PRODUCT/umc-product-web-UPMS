import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/guide')({
  component: () => <h1 className="p-8 text-3xl font-bold">사용 가이드</h1>,
});
