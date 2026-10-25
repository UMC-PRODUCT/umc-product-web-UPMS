import { NOTICE_TITLE_MAX_LENGTH } from '@/entities/notice';
import { cn } from '@/shared/lib/cn';

type NoticeTitleInputProps = {
  value: string;
  onChange: (value: string) => void;
  onExceed: () => void; // 최대 글자수를 넘기려 할 때 (토스트로 안내)
  className?: string;
};

// 피그마: 24px 제목 입력. 비어 있을 때 '제목을 작성하세요'
const NoticeTitleInput = ({ value, onChange, onExceed, className }: NoticeTitleInputProps) => (
  <input
    value={value}
    onChange={(event) => {
      const next = event.target.value;
      if (next.length > NOTICE_TITLE_MAX_LENGTH) {
        onExceed();
        onChange(next.slice(0, NOTICE_TITLE_MAX_LENGTH));
        return;
      }
      onChange(next);
    }}
    placeholder="제목을 작성하세요"
    aria-label="제목"
    className={cn(
      'min-w-0 flex-1 truncate bg-transparent text-heading-2-semibold text-teal-grey-900 outline-none placeholder:text-placeholder',
      className,
    )}
  />
);

export default NoticeTitleInput;
