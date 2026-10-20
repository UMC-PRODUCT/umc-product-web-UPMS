import { SearchField } from '@umc-product/react';

type SearchBarProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

// 목록 화면 공용 검색바 (디자인 시스템 SearchField 기반)
const SearchBar = ({ value, onValueChange, placeholder, className }: SearchBarProps) => (
  <SearchField
    value={value}
    onChange={(event) => onValueChange(event.target.value)}
    placeholder={placeholder}
    aria-label={placeholder}
    className={className}
  />
);

export default SearchBar;
