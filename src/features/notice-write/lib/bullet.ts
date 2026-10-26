export const BULLET = '· ';

type TextSelection = { value: string; start: number; end: number };

const lineStartOf = (value: string, index: number) => value.lastIndexOf('\n', index - 1) + 1;

// 줄 맨 앞에서 '- '를 치면 '· '로 바꾼다. 방금 친 글자가 공백일 때만 부르면 된다.
export const convertDashToBullet = ({ value, start, end }: TextSelection): TextSelection | null => {
  if (start !== end) return null;
  const lineStart = lineStartOf(value, start);
  if (value.slice(lineStart, start) !== '- ') return null;

  const next = value.slice(0, lineStart) + BULLET + value.slice(start);
  const caret = lineStart + BULLET.length;
  return { value: next, start: caret, end: caret };
};

// 불렛 줄에서 Enter: 다음 줄도 불렛으로 시작하고, 내용이 없는 불렛 줄이면 불렛을 지워 목록을 끝낸다.
export const continueBullet = ({ value, start, end }: TextSelection): TextSelection | null => {
  if (start !== end) return null;
  const lineStart = lineStartOf(value, start);
  const lineEndIndex = value.indexOf('\n', start);
  const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
  const line = value.slice(lineStart, lineEnd);
  if (!line.startsWith(BULLET) || start < lineStart + BULLET.length) return null;

  if (line.trim() === BULLET.trim()) {
    return {
      value: value.slice(0, lineStart) + value.slice(lineEnd),
      start: lineStart,
      end: lineStart,
    };
  }

  const insert = `\n${BULLET}`;
  const caret = start + insert.length;
  return { value: value.slice(0, start) + insert + value.slice(start), start: caret, end: caret };
};
