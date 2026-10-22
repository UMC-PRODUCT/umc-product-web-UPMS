import { Select, type SelectOption } from '@umc-product/react';

import SelectDropdown from './SelectDropdown';

export type FilterDropdown<K extends string = string> = {
  key: K;
  label: string; // 선택 전 드롭다운에 보이는 이름
  options: SelectOption[];
  multiple?: boolean; // 다중 선택 여부 (기본 단일 선택)
};

type FilterDropdownGroupProps<K extends string> = {
  filters: FilterDropdown<K>[]; // 사용할 수 있는 드롭다운 전체
  keys?: K[]; // 화면에 띄울 드롭다운만 골라서 이 순서대로 표시 (없으면 전체)
  values: Partial<Record<K, string[]>>; // 선택한 값, 빈 배열이면 전체
  onValueChange: (key: K, value: string[]) => void;
};

// 피그마: 내용 너비만큼만 차지하고, 선택 전 라벨도 기본 텍스트 색
const FILTER_CLASS =
  'w-auto shrink-0 [&_.umc-select\\_\\_trigger]:[--umc-select-placeholder-color:var(--umc-color-text-neutral-default-900)] [&_.umc-select\\_\\_value]:flex-none';

// 목록 화면 공용 필터 드롭다운 모음
// 단일 선택은 DS Select, 다중 선택은 DS가 지원하지 않아 SelectDropdown (다시 누르면 해제)
const FilterDropdownGroup = <K extends string>({
  filters,
  keys,
  values,
  onValueChange,
}: FilterDropdownGroupProps<K>) => {
  const visibleFilters = keys
    ? keys.flatMap((key) => filters.filter((filter) => filter.key === key))
    : filters;

  return (
    <div className="flex shrink-0 items-center gap-2">
      {visibleFilters.map(({ key, label, options, multiple }) =>
        multiple ? (
          <SelectDropdown
            key={key}
            label={label}
            options={options}
            multiple
            value={values[key] ?? []}
            onValueChange={(value) => onValueChange(key, value)}
            className={FILTER_CLASS}
          />
        ) : (
          // 필터 값은 단일 선택이어도 배열 (0개 또는 1개)
          <Select
            key={key}
            variant="filter"
            size="md"
            placeholder={label}
            aria-label={label}
            options={options}
            value={values[key]?.[0] ?? null}
            onValueChange={(value) => onValueChange(key, value ? [value] : [])}
            className={FILTER_CLASS}
          />
        ),
      )}
    </div>
  );
};

export default FilterDropdownGroup;
