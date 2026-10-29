import { SegmentedControl } from '@umc-product/react';

import type { ChapterSummary } from '@/entities/chapter';

type ServerChapterSelectProps = {
  chapters: ChapterSummary[]; // 기수의 전 지부
  value: number | null;
  onValueChange: (chapterId: number) => void;
  // 고를 수 있는 지부 (지부장 · 학교 운영진은 소속 지부 하나). 없으면 전 지부
  selectableChapterId?: number | null;
  onBlockedSelect?: () => void; // 고를 수 없는 지부를 눌렀을 때 (안내 토스트)
};

// 팀 매칭(지원 현황 · 전체 매칭 현황) 지부 탭. 공용 ChapterSelectHeader(mock 지부 · 문자열 ID)와 모양은 같고 서버 지부를 씀
// 전 지부를 보여 주고, 고를 수 없는 지부는 흐리게 표시하고 눌러도 바뀌지 않음
// (DS SegmentedControl에 항목별 비활성이 없어서 선택을 막는 방식)
// TODO: 다른 화면도 서버 지부로 바뀌면 ChapterSelectHeader로 합침
const ServerChapterSelect = ({
  chapters,
  value,
  onValueChange,
  selectableChapterId,
  onBlockedSelect,
}: ServerChapterSelectProps) => {
  const isSelectable = (chapterId: number) =>
    selectableChapterId === undefined || chapterId === selectableChapterId;

  return (
    <SegmentedControl
      aria-label="지부 선택"
      items={chapters.map(({ id, name }) => ({
        value: String(id),
        label: isSelectable(id) ? (
          name
        ) : (
          <span className="text-teal-grey-400" aria-disabled>
            {name}
          </span>
        ),
      }))}
      value={value === null ? '' : String(value)}
      onValueChange={(next) => {
        const chapterId = Number(next);
        if (isSelectable(chapterId)) onValueChange(chapterId);
        else onBlockedSelect?.();
      }}
      // 디자인상 선택되지 않은 지부는 브랜드 색 텍스트 (고를 수 없는 지부는 회색 글자가 우선)
      className="[&_[role=radio]:not([data-checked])]:text-teal-600"
    />
  );
};

export default ServerChapterSelect;
