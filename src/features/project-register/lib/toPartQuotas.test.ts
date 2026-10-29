import { fromPartQuotas, toPartQuotaEntries } from './toPartQuotas';

describe('toPartQuotaEntries', () => {
  it('쓰지 않는 파트는 0으로 보내 이전 정원을 지운다', () => {
    expect(toPartQuotaEntries({ designCount: 0, peCount: 3, pePlatform: 'WEB' })).toEqual([
      { part: 'DESIGN', quota: 0 },
      { part: 'WEB_PRODUCT_ENGINEER', quota: 3 },
      { part: 'MOBILE_PRODUCT_ENGINEER', quota: 0 },
    ]);
  });

  it('Design과 플랫폼의 PE를 파트로 바꾼다', () => {
    expect(toPartQuotaEntries({ designCount: 2, peCount: 1, pePlatform: 'MOBILE' })).toEqual([
      { part: 'DESIGN', quota: 2 },
      { part: 'WEB_PRODUCT_ENGINEER', quota: 0 },
      { part: 'MOBILE_PRODUCT_ENGINEER', quota: 1 },
    ]);
  });
});

describe('fromPartQuotas', () => {
  it('정원이 없으면 아직 설정 전(null)이다', () => {
    expect(fromPartQuotas(undefined)).toBeNull();
    expect(fromPartQuotas([])).toBeNull();
  });

  it('파트별 정원을 모집 정보로 되돌린다', () => {
    expect(
      fromPartQuotas([
        { part: 'DESIGN', quota: 2 },
        { part: 'MOBILE_PRODUCT_ENGINEER', quota: 4 },
      ]),
    ).toEqual({ designCount: 2, peCount: 4, pePlatform: 'MOBILE' });
  });
});
