import { useEffect, useRef, useState } from 'react';

type DebounceOptions = {
  delay: number; // 입력이 멈추고 이만큼(ms) 지나면 반영 (debounce)
  maxWait?: number; // 계속 입력해도 입력을 시작하고 이만큼(ms) 안에는 한 번 반영 (throttle)
};

// 검색어처럼 자주 바뀌는 값을 늦춰서 반영. 서버 요청이 글자마다 나가지 않게 함
// - debounce: 입력이 delay만큼 멈추면 반영
// - throttle(maxWait): 쉬지 않고 계속 입력해도 maxWait마다 중간값을 반영해 목록이 너무 늦게 바뀌지 않음
export const useDebouncedValue = <T>(value: T, { delay, maxWait }: DebounceOptions): T => {
  const [debounced, setDebounced] = useState(value);
  // 반영되지 않은 입력이 처음 생긴 시각 (throttle 기준). 반영하면 비움
  const pendingSince = useRef<number | null>(null);

  useEffect(() => {
    if (Object.is(value, debounced)) {
      pendingSince.current = null;
      return;
    }
    pendingSince.current ??= Date.now();

    const sincePending = Date.now() - pendingSince.current;
    // maxWait가 지나기 전에 debounce가 끝나면 debounce, 아니면 maxWait 시점에 반영
    const wait =
      maxWait === undefined ? delay : Math.max(0, Math.min(delay, maxWait - sincePending));

    const timer = setTimeout(() => {
      pendingSince.current = null;
      setDebounced(value);
    }, wait);
    return () => clearTimeout(timer);
  }, [value, debounced, delay, maxWait]);

  return debounced;
};
