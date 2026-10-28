// 서버가 주는 정식 학교명 중 규칙만으로 줄여지지 않는 것
const SCHOOL_NAME_EXCEPTIONS: Record<string, string> = {
  한국외국어대학교: '한국외대',
};

// 서버의 정식 학교명(OO대학교 · OO여자대학교)을 화면 표기(OO대 · OO여대)로 줄임
// 캠퍼스 등이 붙은 이름도 학교명 부분만 줄임 (예: 한양대학교 ERICA → 한양대 ERICA)
export const formatSchoolName = (name: string | undefined): string => {
  if (!name) return '';

  const [school, ...rest] = name.trim().split(/\s+/);
  const short =
    SCHOOL_NAME_EXCEPTIONS[school] ??
    school.replace(/여자대학교$/, '여대').replace(/대학교$/, '대');
  return [short, ...rest].join(' ');
};
