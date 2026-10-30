import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { LinkProps } from '@tanstack/react-router';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { HeaderActionButton, HeaderDesktop, HeaderProfileMenu } from '@umc-product/react';

import { myInfoQueryOptions, useSessionStore } from '@/entities/session';
import { clearAuthTokens } from '@/shared/api/authToken';

import { toProfileMenu } from './toProfileMenu';

type HeaderNavItem = { label: string; href: NonNullable<LinkProps['to']> };

// 피그마 Web/Header: 홈은 로고(DS HeaderHomeLink, Header 기본 logo)로 이동하고 메뉴는 3개
const NAV_ITEMS: HeaderNavItem[] = [
  { label: '프로젝트', href: '/projects' },
  { label: '데모데이 매칭', href: '/demo-day' },
  { label: '사용 가이드', href: '/guide' },
];

const LOGIN_PATH = '/login';

const Header = () => {
  const pathname = useLocation({ select: (location) => location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const role = useSessionStore((state) => state.session.role);
  // 로그인 화면에서는 토큰이 없어 내 정보를 부르지 않음 (루트 beforeLoad가 이미 불러와 캐시에 있음)
  const { data: profileMenu } = useQuery({
    ...myInfoQueryOptions,
    enabled: pathname !== LOGIN_PATH,
    select: (myInfo) => toProfileMenu(myInfo, role),
  });

  // TODO: 정식 로그인이 붙으면 서버 로그아웃(TOKEN-002)으로 교체. 지금은 QA용 토큰만 지우고 로그인 화면으로
  const handleLogout = () => {
    clearAuthTokens();
    queryClient.clear();
    void navigate({ to: LOGIN_PATH, search: { redirect: pathname } });
  };

  return (
    <HeaderDesktop
      navItems={NAV_ITEMS}
      currentPath={pathname}
      actions={
        <>
          <HeaderActionButton>문의사항</HeaderActionButton>
          {profileMenu && (
            <HeaderProfileMenu
              profile={profileMenu.profile}
              generations={profileMenu.generations}
              generation={profileMenu.generation}
              // TODO: 계정 설정 화면이 생기면 연결
              onLogout={handleLogout}
            />
          )}
        </>
      }
    />
  );
};

export default Header;
