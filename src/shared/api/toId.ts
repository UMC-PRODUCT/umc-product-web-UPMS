// 서버가 int64 ID를 문자열("6")로 내려줌 (OpenAPI 문서와 생성 타입은 number).
// 숫자 · 문자열 어느 쪽으로 와도 비교 · 쿼리 키가 어긋나지 않도록 받는 곳에서 숫자로 맞춤
export const toId = (value: unknown): number | null => {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (value === '') return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
};
