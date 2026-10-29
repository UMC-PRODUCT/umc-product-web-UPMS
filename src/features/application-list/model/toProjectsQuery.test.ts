import { INITIAL_APPLICATION_FILTERS } from './filterOptions';
import { toProjectsQuery } from './toProjectsQuery';

const base = {
  gisuId: 6,
  chapterId: 33,
  keyword: '',
  filters: INITIAL_APPLICATION_FILTERS,
  page: 1,
};

describe('toProjectsQuery', () => {
  it('기본은 지부의 진행 중 프로젝트 첫 페이지 10개', () => {
    expect(toProjectsQuery(base)).toEqual({
      gisuId: 6,
      chapterId: 33,
      statuses: ['IN_PROGRESS'],
      page: 0,
      size: 10,
    });
  });

  it('검색어 · 학교 · 파트 · 모집 상태 · 페이지를 서버 조건으로 바꾼다', () => {
    expect(
      toProjectsQuery({
        ...base,
        keyword: '  UMC ',
        filters: {
          ...INITIAL_APPLICATION_FILTERS,
          school: ['7', '8'],
          part: ['Mobile'],
          recruitStatus: ['CLOSED'],
        },
        page: 3,
      }),
    ).toMatchObject({
      keyword: 'UMC',
      schoolIds: [7, 8],
      parts: ['MOBILE_PRODUCT_ENGINEER'],
      partQuotaStatus: 'COMPLETED',
      page: 2,
    });
  });
});
