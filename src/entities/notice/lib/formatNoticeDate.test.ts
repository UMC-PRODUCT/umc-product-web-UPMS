import { formatNoticeDate } from './formatNoticeDate';

describe('formatNoticeDate', () => {
  it('연도를 두 자리로 줄여 보여준다', () => {
    expect(formatNoticeDate('2026-04-17')).toBe('26-04-17');
  });
});
