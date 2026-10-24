import { FunnelIcon } from '@umc-product/icons';
import { OptionButtonGroup, type OptionItem } from '@umc-product/react';

export type FilteringGroup = {
  label: string; // 스크린리더용 그룹 이름 (예: 차수)
  options: OptionItem[];
  value: string;
  onValueChange: (value: string) => void;
};

type FilteringProps = {
  groups: FilteringGroup[];
  className?: string;
};

// 피그마 필터링 바: "필터" 라벨 + 하나씩 고르는 옵션 버튼 묶음들
const Filtering = ({ groups, className }: FilteringProps) => (
  <div className={`flex items-center gap-4 px-2.5 ${className ?? ''}`}>
    <p className="flex items-center gap-0.5 text-caption-1-regular text-teal-grey-500">
      <FunnelIcon size={14} />
      필터
    </p>
    <div className="flex items-center gap-4">
      {groups.map(({ label, options, value, onValueChange }) => (
        <OptionButtonGroup
          key={label}
          aria-label={label}
          options={options}
          value={value}
          onValueChange={onValueChange}
        />
      ))}
    </div>
  </div>
);

export default Filtering;
