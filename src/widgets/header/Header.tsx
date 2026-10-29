import type { LinkProps } from '@tanstack/react-router';
import { useLocation } from '@tanstack/react-router';
import { Header as UmcHeader, HeaderActionButton } from '@umc-product/react';

import profileDefault from './assets/profile-default.svg';

type HeaderNavItem = { label: string; href: NonNullable<LinkProps['to']> };

// 피그마 Web/Header: 홈은 로고(DS HeaderHomeLink, Header 기본 logo)로 이동하고 메뉴는 3개
const NAV_ITEMS: HeaderNavItem[] = [
  { label: '프로젝트', href: '/projects' },
  { label: '데모데이 매칭', href: '/demo-day' },
  { label: '사용 가이드', href: '/guide' },
];

const Header = () => {
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <UmcHeader
      navItems={NAV_ITEMS}
      currentPath={pathname}
      actions={
        <>
          <HeaderActionButton>문의사항</HeaderActionButton>
          <span className="relative size-10 shrink-0 overflow-clip rounded-full bg-[#e9ecec]">
            <img
              src={profileDefault}
              alt="프로필"
              width={36}
              height={36}
              className="absolute top-[7px] left-1/2 block max-w-none -translate-x-1/2"
            />
          </span>
        </>
      }
    />
  );
};

export default Header;
