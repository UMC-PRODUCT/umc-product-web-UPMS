import { SegmentedControl } from '@umc-product/react';

import { useVisibleChapters } from '../model/useVisibleChapters';

type ChapterSelectHeaderProps = {
  value: string;
  onValueChange: (chapterId: string) => void;
};

const ChapterSelectHeader = ({ value, onValueChange }: ChapterSelectHeaderProps) => {
  const chapters = useVisibleChapters();
  const items = chapters.map((chapter) => ({ value: chapter.id, label: chapter.name }));

  return (
    <SegmentedControl
      aria-label="지부 선택"
      items={items}
      value={value}
      onValueChange={onValueChange}
      // 디자인상 선택되지 않은 지부는 브랜드 색 텍스트
      className="[&_[role=radio]:not([data-checked])]:text-teal-600"
    />
  );
};

export default ChapterSelectHeader;
