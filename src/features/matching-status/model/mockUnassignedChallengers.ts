import type { MatchingPart, UnassignedChallenger } from './types';

// 닉네임/이름 · 학교 조합 (어떤 파트 빈 칸에서 검색해도 여러 명이 나오도록)
const PEOPLE: [string, string][] = [
  ['카피바라/김카피', '한국대'],
  ['라쿤/이라쿤', '중앙대'],
  ['수달/박수달', '세종대'],
  ['판다/최판다', '안양대'],
  ['알파카/정알파카', '덕성여대'],
  ['쿼카/한쿼카', '가톨릭대'],
  ['펭귄/오펭귄', '홍익대'],
  ['고양이/윤고양', '한양대 ERICA'],
];

const PARTS: MatchingPart[] = ['DESIGN', 'WEB_PE', 'MOBILE_PE'];

// TODO: 미배정 챌린저 API 연동 시 제거. 파트마다 8명씩
export const MOCK_UNASSIGNED_CHALLENGERS: UnassignedChallenger[] = PARTS.flatMap((part) =>
  PEOPLE.map(([challengerName, schoolName], index) => ({
    challengerId: `${part}-${index}`,
    challengerName,
    schoolName,
    part,
  })),
);
