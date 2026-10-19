import { createFileRoute, Outlet } from '@tanstack/react-router';

import { Sidebar } from '@/widgets/sidebar';

const DemoDayLayout = () => (
  <div className="flex min-h-[calc(100dvh-var(--spacing-header))]">
    <Sidebar />
    <div className="min-w-0 flex-1 bg-teal-grey-50">
      <Outlet />
    </div>
  </div>
);

export const Route = createFileRoute('/demo-day')({
  component: DemoDayLayout,
});
