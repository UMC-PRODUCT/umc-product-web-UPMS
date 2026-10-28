import { OptionButtonGroup } from '@umc-product/react';

import type { ChapterSummary } from '@/entities/chapter';

import ScheduleFieldRow from './ScheduleFieldRow';

type ScheduleChapterFieldProps = {
  chapters: ChapterSummary[];
  value: number | null; // 지부 목록을 불러오기 전이면 null
  onValueChange: (chapterId: number) => void;
  onlyChapterId?: number | null; // 지부장: 소속 지부만 고를 수 있고 나머지는 비활성
  onBlockedClick?: () => void; // 비활성 지부를 눌렀을 때 (피그마: 안내 토스트)
};

// 피그마 기본 매칭 일정 '지부 선택': 디자인 시스템 Option Button Group(Sm)
const ScheduleChapterField = ({
  chapters,
  value,
  onValueChange,
  onlyChapterId,
  onBlockedClick,
}: ScheduleChapterFieldProps) => (
  <ScheduleFieldRow label="지부 선택" align="center">
    {/* 비활성 버튼은 클릭 이벤트가 생기지 않아서 클릭이 감싼 영역으로 오게 하고, 누를 수 있는 버튼이 아니면 안내 */}
    <div
      className="[&_button:disabled]:pointer-events-none"
      onClick={(event) => {
        const enabledOption = (event.target as HTMLElement).closest(
          '[role="radio"]:not([data-disabled]):not(:disabled)',
        );
        if (!enabledOption) onBlockedClick?.();
      }}
    >
      <OptionButtonGroup
        aria-label="지부 선택"
        size="sm"
        // 옵션 값은 문자열이라 숫자 지부 ID를 바꿔서 넘김
        options={chapters.map(({ id, name }) => ({
          value: String(id),
          label: name,
          disabled: onlyChapterId !== undefined && id !== onlyChapterId,
        }))}
        value={value === null ? null : String(value)}
        onValueChange={(chapterId) => onValueChange(Number(chapterId))}
      />
    </div>
  </ScheduleFieldRow>
);

export default ScheduleChapterField;
