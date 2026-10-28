import { TextFieldBox } from '@umc-product/react';
import { useId, useState } from 'react';

import type { PmCandidate } from '../model/types';

type PmComboboxProps = {
  'aria-label': string;
  placeholder: string;
  candidates: PmCandidate[];
  value: string; // 고른 PM id, 없으면 ''
  isDisabled: (candidate: PmCandidate) => boolean; // 이미 다른 칸에서 고른 PM
  onChange: (id: string) => void;
};

const getPmName = ({ nickname, name }: PmCandidate) => `${nickname}/${name}`;

// 피그마 Text Field/Input Box + PM 정보 등록 List: 입력창에 바로 검색어를 쓰면 목록이 걸러지고, 항목을 고르면 닉네임/이름이 입력창에 채워짐
const PmCombobox = ({
  'aria-label': ariaLabel,
  placeholder,
  candidates,
  value,
  isDisabled,
  onChange,
}: PmComboboxProps) => {
  const listId = useId();
  const selected = candidates.find(({ id }) => id === value) ?? null;
  const selectedName = selected ? getPmName(selected) : '';

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);

  // 고른 값을 그대로 보여주는 동안(검색어를 새로 쓰기 전)에는 전체 목록을 보여줌
  const keyword = query.trim().toLowerCase();
  const isSearching = open && keyword !== '' && query !== selectedName;
  const visible = isSearching
    ? candidates.filter((candidate) =>
        `${getPmName(candidate)} ${candidate.schoolName}`.toLowerCase().includes(keyword),
      )
    : candidates;

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const select = (candidate: PmCandidate) => {
    if (isDisabled(candidate)) return;
    onChange(candidate.id);
    close();
  };

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      <TextFieldBox
        aria-label={ariaLabel}
        size="md"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder={placeholder}
        value={open ? query : selectedName}
        onFocus={(event) => {
          setQuery(selectedName);
          setHighlighted(0);
          setOpen(true);
          event.currentTarget.select();
        }}
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          setHighlighted(0);
          setOpen(true);
          // 지우기 버튼 등으로 전부 지우면 선택도 해제
          if (next === '' && value !== '') onChange('');
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
            setHighlighted((index) => Math.min(index + 1, visible.length - 1));
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlighted((index) => Math.max(index - 1, 0));
          } else if (event.key === 'Enter' && open && visible[highlighted]) {
            event.preventDefault();
            select(visible[highlighted]);
          } else if (event.key === 'Escape') {
            close();
          }
        }}
      />
      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          // 목록 최대 높이: 피그마처럼 일부가 잘려 보이며 스크롤
          style={{ maxHeight: 256 }}
          className="umc-dropdown-list absolute top-full right-0 left-0 z-50 mt-1"
        >
          {visible.length === 0 ? (
            <p className="flex h-10 items-center px-4 text-body-2-regular text-teal-grey-400">
              검색 결과가 없어요
            </p>
          ) : (
            visible.map((candidate, index) => {
              const isSelected = candidate.id === value;
              const disabled = isDisabled(candidate);
              return (
                <div
                  key={candidate.id}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={disabled}
                  data-highlighted={index === highlighted ? '' : undefined}
                  data-disabled={disabled ? '' : undefined}
                  className="umc-dropdown-item h-10 shrink-0 justify-start px-4 py-0 text-[14px] text-teal-grey-700"
                  // 입력창 포커스를 잃기 전에 선택을 끝내기 위해 mousedown에서 처리
                  onMouseDown={(event) => {
                    event.preventDefault();
                    select(candidate);
                  }}
                  onMouseEnter={() => setHighlighted(index)}
                >
                  <span className={isSelected ? 'font-bold' : 'font-medium'}>
                    {getPmName(candidate)}
                  </span>
                  {!isSelected && (
                    <span className="font-medium text-[#9ca3a3]"> · {candidate.schoolName}</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default PmCombobox;
