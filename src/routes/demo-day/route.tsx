import { createFileRoute, Outlet } from '@tanstack/react-router';

import { Sidebar } from '@/widgets/sidebar';

const DemoDayLayout = () => (
  <div className="flex min-h-[calc(100dvh-var(--spacing-header))]">
    {/* DS SideNavigation은 width 100%라서 폭(피그마 Web/Side Navigation 216px)을 정해주는 래퍼가 필요 */}
    <div className="w-sidebar shrink-0">
      <Sidebar />
    </div>
    <div className="min-w-0 flex-1 bg-teal-grey-50">
      <Outlet />
    </div>
  </div>
);

export const Route = createFileRoute('/demo-day')({
  component: DemoDayLayout,
});
