import { createFileRoute } from '@tanstack/react-router';

import { LoginForm, toSafeRedirect } from '@/features/auth';

type LoginSearch = { redirect?: string; error?: string };

const LoginPage = () => {
  const { redirect, error } = Route.useSearch();

  return (
    <main className="flex flex-1 items-center justify-center bg-teal-grey-50 px-4 py-20">
      <LoginForm redirectTo={toSafeRedirect(redirect)} initialError={error} />
    </main>
  );
};

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
    error: typeof search.error === 'string' ? search.error : undefined,
  }),
  component: LoginPage,
});
