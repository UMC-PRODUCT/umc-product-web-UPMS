import { describe, expect, it } from 'vitest';

import { INITIAL_PROJECT_FILTERS } from '../model/projectFilters';
import { toProjectsQuery } from './toProjectsQuery';

describe('toProjectsQuery', () => {
  it('필터가 없으면 기수와 공개 상태 · 첫 페이지(0)만 보냄', () => {
    expect(
      toProjectsQuery({ gisuId: 6, keyword: ' ', filters: INITIAL_PROJECT_FILTERS, page: 1 }),
    ).toEqual({
      gisuId: 6,
      keyword: undefined,
      chapterId: undefined,
      schoolIds: undefined,
      parts: undefined,
      partQuotaStatus: undefined,
      statuses: ['IN_PROGRESS', 'COMPLETED'],
      page: 0,
      size: 12,
    });
  });

  it('화면 필터를 서버 값으로 바꿈', () => {
    const query = toProjectsQuery({
      gisuId: 6,
      keyword: ' UMC ',
      filters: {
        chapter: ['3'],
        school: ['10', '11'],
        part: ['Web', 'Mobile'],
        recruitStatus: ['CLOSED'],
      },
      page: 3,
    });
    expect(query).toMatchObject({
      keyword: 'UMC',
      chapterId: 3,
      schoolIds: [10, 11],
      parts: ['WEB_PRODUCT_ENGINEER', 'MOBILE_PRODUCT_ENGINEER'],
      partQuotaStatus: 'COMPLETED',
      page: 2,
    });
  });
});
