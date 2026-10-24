import { SegmentedControl } from '@umc-product/react';

import { cn } from '@/shared/lib/cn';

import { useVisibleChapters } from '../model/useVisibleChapters';

type ChapterSelectHeaderProps = {
  value: string;
  onValueChange: (chapterId: string) => void;
  className?: string;
};

const ChapterSelectHeader = ({ value, onValueChange, className }: ChapterSelectHeaderProps) => {
  const chapters = useVisibleChapters();
  const items = chapters.map((chapter) => ({ value: chapter.id, label: chapter.name }));

  return (
    <SegmentedControl
      aria-label="지부 선택"
      items={items}
      value={value}
      onValueChange={onValueChange}
      // 디자인상 선택되지 않은 지부는 브랜드 색 텍스트
      className={cn('[&_[role=radio]:not([data-checked])]:text-teal-600', className)}
    />
  );
};

export default ChapterSelectHeader;
