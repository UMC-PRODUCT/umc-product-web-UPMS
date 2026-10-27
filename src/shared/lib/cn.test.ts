import { cn } from './cn';

describe('cn', () => {
  it('DS 텍스트 스타일과 글자색을 같이 쓰면 둘 다 남긴다', () => {
    expect(cn('text-title-2-semibold', 'text-teal-600')).toBe(
      'text-title-2-semibold text-teal-600',
    );
  });

  it('같은 글자색이 겹치면 뒤의 것만 남긴다', () => {
    expect(cn('text-teal-grey-900', 'text-teal-600')).toBe('text-teal-600');
  });

  it('DS 그림자와 다른 유틸리티를 같이 쓰면 둘 다 남긴다', () => {
    expect(cn('shadow-inner-neutral-2', 'rounded-xl')).toBe('shadow-inner-neutral-2 rounded-xl');
  });
});
