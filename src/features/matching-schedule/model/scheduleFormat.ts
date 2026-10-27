const pad = (value: number) => String(value).padStart(2, '0');

// 숫자만 남겨 "2026-10-01" 모양으로 하이픈을 자동으로 넣음 (피그마: 숫자만 입력)
export const formatDateDigits = (input: string) => {
  const digits = input.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)].filter(Boolean).join('-');
};

// 숫자만 남겨 "22:00" 모양으로 콜론을 자동으로 넣음
export const formatTimeDigits = (input: string) => {
  const digits = input.replace(/\D/g, '').slice(0, 4);
  return [digits.slice(0, 2), digits.slice(2, 4)].filter(Boolean).join(':');
};

// "YYYY-MM-DD"가 실제 있는 날짜면 Date, 아니면 null (예: 2026-02-30은 null)
export const parseDate = (value: string | null): Date | null => {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : null;
};

export const isValidTime = (value: string | null) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value ?? '');

export const toDateString = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const toTimeString = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export const addDays = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
