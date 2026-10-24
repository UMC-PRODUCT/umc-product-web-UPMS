import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { LinkProvider, ToastProvider } from '@umc-product/react';

import { RouterLink } from '@/shared/ui/RouterLink';
import { Header } from '@/widgets/header';

export const Route = createRootRoute({
  component: () => (
    <LinkProvider component={RouterLink}>
      <ToastProvider placement="bottom">
        <Header />
        <Outlet />
        <TanStackRouterDevtools />
      </ToastProvider>
    </LinkProvider>
  ),
});
