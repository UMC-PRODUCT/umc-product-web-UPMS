import type { ReactNode } from 'react';

// lg: 페이지 배경 위에 바로 놓이는 섹션 / md: 흰 카드 안에 들어가는 섹션
type SectionTitleSize = 'lg' | 'md';

type SectionTitleProps = {
  order: string;
  title: ReactNode;
  caption?: ReactNode;
  size?: SectionTitleSize;
};

const SIZE_CLASS: Record<SectionTitleSize, { text: string; order: string; caption: string }> = {
  lg: { text: 'text-title-2-semibold', order: 'w-[30px]', caption: 'h-7' },
  md: { text: 'text-title-3-medium font-semibold', order: 'w-7', caption: 'h-[25px]' },
};

export const SectionTitle = ({ order, title, caption, size = 'lg' }: SectionTitleProps) => {
  const sizeClass = SIZE_CLASS[size];

  return (
    <div className="flex w-full items-start gap-1 px-1.5">
      <p className={`shrink-0 text-teal-600 ${sizeClass.order} ${sizeClass.text}`}>{order}</p>
      <div className="flex min-w-0 flex-1 items-start justify-between">
        <h2 className={`whitespace-nowrap text-teal-grey-900 ${sizeClass.text}`}>{title}</h2>
        {caption && (
          <div
            className={`flex w-[200px] shrink-0 items-center justify-center text-body-3-regular whitespace-nowrap text-teal-grey-600 ${sizeClass.caption}`}
          >
            {caption}
          </div>
        )}
      </div>
    </div>
  );
};
