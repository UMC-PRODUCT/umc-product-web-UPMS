import { CheckIcon, ExpandMoreIcon } from '@umc-product/icons';
import type { SelectOption } from '@umc-product/react';
import {
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

type SelectDropdownProps = {
  label: string;
  options: SelectOption[];
  multiple?: boolean; // true: 여러 개 체크 / false: 하나만 선택하고 닫힘
  value: string[]; // 단일 선택이어도 배열 (0개 또는 1개)
  onValueChange: (value: string[]) => void;
  className?: string;
};

// 선택한 항목이 여러 개면 "첫 항목 외 N" (목록 순서 기준)
const getSelectedText = (options: SelectOption[], value: string[]): ReactNode => {
  const selected = options.filter((option) => value.includes(option.value));
  if (selected.length === 0) return null;
  if (selected.length === 1) return selected[0].label;
  return (
    <>
      {selected[0].label} 외 {selected.length - 1}
    </>
  );
};

// 디자인 시스템 Select와 같은 스타일 클래스로 만든 필터 드롭다운
// (DS Select는 다중 선택과 다시 눌러 해제하기를 지원하지 않음)
// 선택한 항목을 다시 누르면 해제되고, 모두 해제하면 빈 배열 (= 전체)
const SelectDropdown = ({
  label,
  options,
  multiple = false,
  value,
  onValueChange,
  className = '',
}: SelectDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selectedText = getSelectedText(options, value);

  // 바깥을 누르면 닫기
  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutside);
    return () => document.removeEventListener('pointerdown', closeOnOutside);
  }, [open]);

  const openList = () => {
    setHighlighted(-1);
    setOpen(true);
  };

  const toggleOption = (optionValue: string) => {
    if (multiple) {
      onValueChange(
        value.includes(optionValue)
          ? value.filter((selected) => selected !== optionValue)
          : [...value, optionValue],
      );
      return;
    }
    // 단일 선택: 같은 항목을 다시 누르면 해제, 고르거나 해제하면 바로 닫기
    onValueChange(value.includes(optionValue) ? [] : [optionValue]);
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) return openList();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setHighlighted((prev) => (prev + step + options.length) % options.length);
    } else if ((event.key === 'Enter' || event.key === ' ') && open && highlighted >= 0) {
      event.preventDefault();
      toggleOption(options[highlighted].value);
    } else if (event.key === 'Escape' || event.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        className="umc-select__trigger"
        data-size="md"
        data-variant="filter"
        data-filled={value.length > 0 ? '' : undefined}
        data-popup-open={open ? '' : undefined}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && highlighted >= 0 ? `${listId}-${highlighted}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
      >
        <span className="umc-select__value" data-placeholder={selectedText ? undefined : ''}>
          {selectedText ?? label}
        </span>
        <span aria-hidden className="umc-select__icon">
          <ExpandMoreIcon weight="fill" size={16} />
        </span>
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-multiselectable={multiple}
          aria-label={label}
          className="umc-dropdown-list absolute top-full left-0 z-20 mt-1 min-w-full"
          style={{ '--available-height': '320px' } as CSSProperties}
        >
          {options.map((option, index) => {
            const selected = value.includes(option.value);
            return (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={selected}
                className="umc-dropdown-item"
                data-size="sm"
                data-selected={selected ? '' : undefined}
                data-highlighted={index === highlighted ? '' : undefined}
                onMouseEnter={() => setHighlighted(index)}
                // 트리거 포커스 유지
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => toggleOption(option.value)}
              >
                <span className="umc-dropdown-item__content whitespace-nowrap">{option.label}</span>
                {selected && (
                  <span aria-hidden className="umc-dropdown-item__indicator">
                    <CheckIcon size={16} />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SelectDropdown;
