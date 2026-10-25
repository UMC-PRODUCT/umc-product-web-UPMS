import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

type NoticeCardProps = {
  className?: string;
  children: ReactNode;
};

// 공지 목록·작성 화면의 흰 카드 (피그마 '공지 목록 카드': 모서리 16, 테두리 #eff0f0, 그림자 Drop/Neutral_3)
const NoticeCard = ({ className, children }: NoticeCardProps) => (
  <div
    className={cn(
      'w-full rounded-2xl border border-teal-grey-100 bg-white shadow-drop-neutral-3',
      className,
    )}
  >
    {children}
  </div>
);

export default NoticeCard;
