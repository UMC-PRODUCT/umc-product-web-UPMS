import type { SchoolMatching } from './types';

// TODO: 매칭 현황 API 연동 시 제거
export const MOCK_SCHOOL_MATCHINGS: SchoolMatching[] = [
  { schoolName: '가톨릭대학교', matched: 18, total: 24 },
  { schoolName: '덕성여자대학교', matched: 12, total: 16 },
  { schoolName: '세종대학교', matched: 15, total: 18 },
  { schoolName: '안양대학교', matched: 7, total: 9 },
  { schoolName: '홍익대학교 서울', matched: 12, total: 15 },
];
