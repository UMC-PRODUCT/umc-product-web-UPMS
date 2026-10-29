import { act, renderHook } from '@testing-library/react';

import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('입력이 delay만큼 멈춘 뒤에 반영한다 (debounce)', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, { delay: 300 }),
      { initialProps: { value: '' } },
    );

    rerender({ value: 'U' });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 'UM' });
    act(() => vi.advanceTimersByTime(200));
    // 마지막 입력 후 300ms가 안 지남
    expect(result.current).toBe('');

    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe('UM');
  });

  it('계속 입력해도 maxWait마다 중간값을 반영한다 (throttle)', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, { delay: 300, maxWait: 1000 }),
      { initialProps: { value: '' } },
    );

    // 200ms마다 한 글자씩 쉬지 않고 입력 (debounce만으론 끝날 때까지 반영 안 됨)
    let typed = '';
    for (let i = 0; i < 5; i += 1) {
      typed += 'a';
      rerender({ value: typed });
      act(() => vi.advanceTimersByTime(200));
    }

    // 입력을 시작하고 1000ms가 지나 중간값이 반영됨
    expect(result.current).toBe('aaaaa');
  });

  it('오래 쉬었다 입력해도 첫 글자를 바로 반영하지 않는다', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, { delay: 300, maxWait: 1000 }),
      { initialProps: { value: '' } },
    );

    act(() => vi.advanceTimersByTime(5000));
    rerender({ value: 'U' });
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe('');

    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('U');
  });
});
