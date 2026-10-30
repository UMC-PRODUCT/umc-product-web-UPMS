import { describe, expect, it } from 'vitest';

import { formatSchoolName } from './formatSchoolName';

describe('formatSchoolName', () => {
  it.each([
    ['한국대학교', '한국대'],
    ['서울여자대학교', '서울여대'],
    ['한국외국어대학교', '한국외대'],
    ['한양대학교 ERICA', '한양대 ERICA'],
    ['홍익대학교 서울', '홍익대 서울'],
    ['한국대', '한국대'], // 이미 줄여진 이름은 그대로
    ['', ''],
  ])('%s → %s', (input, expected) => {
    expect(formatSchoolName(input)).toBe(expected);
  });

  it('값이 없으면 빈 문자열', () => {
    expect(formatSchoolName(undefined)).toBe('');
  });
});
