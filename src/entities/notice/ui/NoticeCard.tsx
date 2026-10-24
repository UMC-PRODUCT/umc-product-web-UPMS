import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

type NoticeCardProps = {
  className?: string;
  children: ReactNode;
};

// 공지 화면(목록·작성)의 흰 카드. 안쪽 여백은 화면마다 달라서 className으로 받는다.
const NoticeCard = ({ className, children }: NoticeCardProps) => (
  <div className={cn('w-full rounded-xl border border-teal-grey-100 bg-white', className)}>
    {children}
  </div>
);

export default NoticeCard;
