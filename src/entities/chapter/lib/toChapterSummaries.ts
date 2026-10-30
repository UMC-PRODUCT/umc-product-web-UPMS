import { toId } from '@/shared/api/toId';

import type { GisuOrganizationResponse } from '../api/getChapters';

// 서버 학교 (지부 소속)
export type SchoolSummary = { id: number; name: string };

// 서버 지부 (MOCK_CHAPTERS의 Chapter와 달리 숫자 ID)
export type ChapterSummary = { id: number; name: string; schools: SchoolSummary[] };

// 문서(ChapterItem)는 id · name이지만 실제 응답은 chapterId · chapterName이고 ID는 문자열
// 지부 소속 학교는 문서(SchoolItem)대로 schoolId · schoolName (ID는 문자열)
type SchoolResponseItem = { schoolId?: unknown; schoolName?: unknown };
type ChapterResponseItem = {
  chapterId?: unknown;
  chapterName?: unknown;
  schools?: SchoolResponseItem[];
};

const toSchools = (schools: SchoolResponseItem[] = []): SchoolSummary[] =>
  schools.flatMap(({ schoolId, schoolName }) => {
    const id = toId(schoolId);
    return id !== null && typeof schoolName === 'string' ? [{ id, name: schoolName }] : [];
  });

// 기수 조직 정보 응답에서 첫 기수의 지부 목록(소속 학교 포함)만 꺼냄. ID · 이름이 없는 지부 · 학교는 뺌
export const toChapterSummaries = ({ gisus }: GisuOrganizationResponse): ChapterSummary[] => {
  const chapters = (gisus?.[0]?.chapters ?? []) as unknown as ChapterResponseItem[];
  return chapters.flatMap(({ chapterId, chapterName, schools }) => {
    const id = toId(chapterId);
    return id !== null && typeof chapterName === 'string'
      ? [{ id, name: chapterName, schools: toSchools(schools) }]
      : [];
  });
};
