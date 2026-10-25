const MARK = '**';

type TextSelection = { value: string; start: number; end: number };

// Ctrl+B: 선택한 글자를 **굵게**로 감싸고, 이미 감싸져 있으면 풀어 준다. 선택이 없으면 빈 표식을 넣고 그 안에 커서를 둔다.
export const toggleBold = ({ value, start, end }: TextSelection): TextSelection => {
  const selected = value.slice(start, end);
  const before = value.slice(0, start);
  const after = value.slice(end);

  // 선택한 글자 바로 앞뒤가 이미 표식이면 풀기
  if (before.endsWith(MARK) && after.startsWith(MARK)) {
    const nextBefore = before.slice(0, -MARK.length);
    return {
      value: nextBefore + selected + after.slice(MARK.length),
      start: nextBefore.length,
      end: nextBefore.length + selected.length,
    };
  }

  // 선택한 글자에 표식이 포함되어 있으면 풀기
  if (selected.length > MARK.length * 2 && selected.startsWith(MARK) && selected.endsWith(MARK)) {
    const inner = selected.slice(MARK.length, -MARK.length);
    return { value: before + inner + after, start, end: start + inner.length };
  }

  return {
    value: before + MARK + selected + MARK + after,
    start: start + MARK.length,
    end: end + MARK.length,
  };
};
