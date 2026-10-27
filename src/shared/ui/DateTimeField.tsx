import { TextFieldBoxField } from '@umc-product/react';

export type DateTimeFieldType = 'date' | 'time';

const DEFAULT_PLACEHOLDER: Record<DateTimeFieldType, string> = {
  date: '2026-00-00',
  time: '00:00',
};

type DateTimeFieldProps = {
  type: DateTimeFieldType;
  value: string;
  onValueChange?: (value: string) => void; // 없으면 입력할 수 없는 칸 (Disabled): 자동 계산 · 수정 불가
  formatValue?: (input: string) => string; // 입력할 때마다 하이픈 · 콜론을 넣는 등 모양을 맞춤
  prefix?: string; // 칸 앞 라벨 (예: 시작, 종료)
  placeholder?: string;
  invalid?: boolean;
  onDisabledClick?: () => void; // 입력할 수 없는 칸을 눌렀을 때 (예: 먼저 입력할 칸 안내)
  'aria-label': string;
  className?: string;
};

// 피그마 Text Field/Box/Date & Time: 디자인 시스템 입력 상자(Md, 44px) 안에 앞 라벨 + 날짜 · 시각
// 디자인 시스템에 날짜 · 시각 입력이 없어서 입력 상자로 조합함
const DateTimeField = ({
  type,
  value,
  onValueChange,
  formatValue = (input) => input,
  prefix,
  placeholder = DEFAULT_PLACEHOLDER[type],
  invalid = false,
  onDisabledClick,
  'aria-label': ariaLabel,
  className = '',
}: DateTimeFieldProps) => {
  const disabled = !onValueChange;

  return (
    <TextFieldBoxField
      size="md"
      disabled={disabled}
      invalid={invalid}
      onClick={disabled ? onDisabledClick : undefined}
      // 피그마: 날짜 칸 156px, 시각 칸은 글자 폭만큼 (74px)
      className={`w-fit shrink-0 gap-1.5 ${className}`}
    >
      {prefix && (
        <span className={`shrink-0 ${disabled ? 'text-teal-grey-400' : 'text-teal-grey-900'}`}>
          {prefix}
        </span>
      )}
      <input
        // 비활성 입력은 클릭 이벤트가 생기지 않아서, 클릭이 상자로 가도록 함
        className="umc-text-field-box-field__input [field-sizing:content] disabled:pointer-events-none"
        inputMode="numeric"
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        maxLength={type === 'date' ? 10 : 5}
        onChange={(event) => onValueChange?.(formatValue(event.target.value))}
      />
    </TextFieldBoxField>
  );
};

export default DateTimeField;
