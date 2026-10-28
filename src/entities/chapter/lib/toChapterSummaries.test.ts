import type { GisuOrganizationResponse } from '../api/getChapters';
import { toChapterSummaries } from './toChapterSummaries';

// 개발 서버 실제 응답 (/api/v2/gisu?id=6&includeChapter=true). 문서와 필드 이름 · ID 타입이 다름
const response = {
  gisus: [
    {
      gisuId: '6',
      generation: '11',
      isActive: true,
      chapters: [
        { chapterId: '42', chapterName: '수달', schools: [] },
        { chapterId: '37', chapterName: '쿼카', schools: [] },
        { chapterId: '33', chapterName: '캥거루', schools: [] },
      ],
      schools: [],
    },
  ],
} as unknown as GisuOrganizationResponse;

describe('toChapterSummaries', () => {
  it('chapterId · chapterName을 숫자 ID와 이름으로 바꾼다', () => {
    expect(toChapterSummaries(response)).toEqual([
      { id: 42, name: '수달' },
      { id: 37, name: '쿼카' },
      { id: 33, name: '캥거루' },
    ]);
  });

  it('ID나 이름이 없는 지부는 뺀다', () => {
    const broken = {
      gisus: [{ chapters: [{ chapterName: '이름만' }, { chapterId: '1' }] }],
    } as unknown as GisuOrganizationResponse;
    expect(toChapterSummaries(broken)).toEqual([]);
  });

  it('기수가 없으면 빈 목록', () => {
    expect(toChapterSummaries({ gisus: [] })).toEqual([]);
  });
});
