import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { LinkProvider } from '@umc-product/react';

import { MOCK_CHAPTERS } from '@/entities/chapter';
import { myInfoQueryOptions, type Session, toSession, useSessionStore } from '@/entities/session';
import { clearAuthTokens, getAccessToken } from '@/shared/api/authToken';
import { ApiError } from '@/shared/api/client';
import { RouterLink } from '@/shared/ui/RouterLink';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { ToastProvider } from '@/widgets/toast';

// TODO: 정식 로그인(다른 팀)이 붙으면 그쪽 경로로 교체
const PUBLIC_PATHS = ['/login'];

const isSameSession = (left: Session, right: Session) =>
  left.role === right.role &&
  left.challengerType === right.challengerType &&
  left.chapterId === right.chapterId &&
  left.serverChapterId === right.serverChapterId &&
  left.gisuId === right.gisuId;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // 하위 라우트의 권한 확인(beforeLoad)보다 먼저 실행돼서, 화면을 그리기 전에 내 정보로 세션을 채움
  beforeLoad: async ({ context, location }) => {
    // 로그인 화면은 토큰 없이 들어와야 함
    if (PUBLIC_PATHS.includes(location.pathname)) return;

    const toLogin = () => redirect({ to: '/login', search: { redirect: location.href } });
    if (!getAccessToken() && !import.meta.env.VITE_DEV_ACCESS_TOKEN) throw toLogin();

    const myInfo = await context.queryClient
      .ensureQueryData(myInfoQueryOptions)
      .catch((error: unknown) => {
        // 토큰이 만료 · 무효면 다시 로그인
        if (error instanceof ApiError && error.status === 401) {
          clearAuthTokens();
          throw toLogin();
        }
        throw error;
      });
    const { chapterName, ...serverSession } = toSession(myInfo);
    const session: Session = {
      ...serverSession,
      // TODO: mock 지부를 쓰는 화면이 서버 지부로 바뀌면 제거. 지금은 이름으로 mock 지부를 찾음
      chapterId: MOCK_CHAPTERS.find(({ name }) => name === chapterName)?.id ?? null,
    };

    // 이동할 때마다 실행되므로, 바뀌었을 때만 넣어야 뷰 선택(setSession이 초기화)이 유지됨
    const { session: current, setSession } = useSessionStore.getState();
    if (!isSameSession(current, session)) setSession(session);
  },
  component: () => (
    <LinkProvider component={RouterLink}>
      <ToastProvider>
        {/* 내용이 짧아도 푸터가 화면 맨 아래에 붙도록 내용 영역이 남는 높이를 채움 */}
        <div className="flex min-h-dvh flex-col">
          <Header />
          <div className="flex flex-1 flex-col">
            <Outlet />
          </div>
          <Footer />
        </div>
      </ToastProvider>
      <TanStackRouterDevtools />
    </LinkProvider>
  ),
});
