import { toSafeRedirect } from './toSafeRedirect';

describe('toSafeRedirect', () => {
  it('우리 서비스 경로만 허용한다', () => {
    expect(toSafeRedirect('/demo-day?tab=1')).toBe('/demo-day?tab=1');
    expect(toSafeRedirect('//evil.com')).toBe('/');
    expect(toSafeRedirect('https://evil.com')).toBe('/');
    expect(toSafeRedirect(undefined)).toBe('/');
  });
});
