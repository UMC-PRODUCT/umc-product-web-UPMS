import { type ChangeEvent, type KeyboardEvent, useRef } from 'react';

import { NOTICE_CONTENT_MAX_LENGTH } from '@/entities/notice';
import { cn } from '@/shared/lib/cn';

import { continueBullet, convertDashToBullet } from '../lib/bullet';
import { toggleBold } from '../lib/toggleBold';

type NoticeContentEditorProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

// 피그마 Web/Notice/Item Content (Type=Edit): 본문 입력 + 글자수. Ctrl+B로 **굵게**, 줄 앞 '- '로 불렛을 넣는다.
const NoticeContentEditor = ({ value, onChange, className }: NoticeContentEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyEdit = (next: { value: string; start: number; end: number }) => {
    onChange(next.value.slice(0, NOTICE_CONTENT_MAX_LENGTH));
    // 값이 바뀐 뒤에 선택 범위를 되돌려야 해서 다음 프레임에 맞춘다
    requestAnimationFrame(() => textareaRef.current?.setSelectionRange(next.start, next.end));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;
    const selection = {
      value: textarea.value,
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    };

    const isBold = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b';
    if (isBold) {
      event.preventDefault();
      applyEdit(toggleBold(selection));
      return;
    }

    // 한글 조합 중 Enter는 글자 확정이라 건드리지 않는다
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      const next = continueBullet(selection);
      if (next) {
        event.preventDefault();
        applyEdit(next);
      }
    }
  };

  // 줄 맨 앞에서 '- ' 를 치면 불렛('· ')으로 바꾼다
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value: nextValue, selectionStart, selectionEnd } = event.target;
    const typedSpace = (event.nativeEvent as InputEvent).data === ' ';
    const bullet =
      typedSpace &&
      convertDashToBullet({ value: nextValue, start: selectionStart, end: selectionEnd });
    if (bullet) applyEdit(bullet);
    else onChange(nextValue);
  };

  return (
    <div className={cn('flex flex-col px-8', className)}>
      <div className="flex flex-1 flex-col items-end gap-8 rounded-xl bg-teal-grey-50 px-6 py-5 shadow-inner-neutral-2">
        <div className="relative flex w-full flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            maxLength={NOTICE_CONTENT_MAX_LENGTH}
            aria-label="내용"
            className="field-sizing-content min-h-[200px] w-full flex-1 resize-none bg-transparent text-body-1-regular leading-[1.6] text-teal-grey-900 outline-none"
          />
          {value === '' && (
            // 안내 문구 안에 굵은 글씨가 있어서 textarea의 placeholder 대신 겹쳐 보여준다
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 text-body-1-regular leading-[1.6] text-placeholder"
            >
              <p>내용을 입력하세요.</p>
              <p>&nbsp;</p>
              <p>특정 파트에게 전달하는 공지는 제목에 기재해주세요.</p>
              <p>ex. [PM] 프로젝트 등록 관련</p>
              <p>&nbsp;</p>
              <p>
                <strong className="font-bold">Ctrl+B</strong>로{' '}
                <strong className="font-bold">볼드체</strong>를 사용 할 수 있어요
              </p>
            </div>
          )}
        </div>
        <p className="text-body-2-regular text-placeholder">
          {value.length}/{NOTICE_CONTENT_MAX_LENGTH}
        </p>
      </div>
    </div>
  );
};

export default NoticeContentEditor;
