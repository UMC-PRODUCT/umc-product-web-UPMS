import { toId } from '@/shared/api/toId';

import type { GisuOrganizationResponse } from '../api/getChapters';

// 서버 지부 (MOCK_CHAPTERS의 Chapter와 달리 숫자 ID, 학교 목록 없음)
export type ChapterSummary = { id: number; name: string };

// 문서(ChapterItem)는 id · name이지만 실제 응답은 chapterId · chapterName이고 ID는 문자열
type ChapterResponseItem = { chapterId?: unknown; chapterName?: unknown };

// 기수 조직 정보 응답에서 첫 기수의 지부 목록만 꺼냄. ID · 이름이 없는 지부는 뺌
export const toChapterSummaries = ({ gisus }: GisuOrganizationResponse): ChapterSummary[] => {
  const chapters = (gisus?.[0]?.chapters ?? []) as unknown as ChapterResponseItem[];
  return chapters.flatMap(({ chapterId, chapterName }) => {
    const id = toId(chapterId);
    return id !== null && typeof chapterName === 'string' ? [{ id, name: chapterName }] : [];
  });
};
