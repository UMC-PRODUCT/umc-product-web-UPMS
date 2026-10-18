import { Link, type LinkProps } from '@tanstack/react-router';
import type { LinkComponentProps } from '@umc-product/react';

// 디자인 시스템 shell 컴포넌트(Header 등)가 <a> 대신 TanStack Router Link로 이동하도록 연결하는 어댑터
export const RouterLink = ({ href, ...props }: LinkComponentProps) => (
  <Link to={href as LinkProps['to']} {...props} />
);
