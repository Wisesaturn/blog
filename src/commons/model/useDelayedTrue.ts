import { useEffect, useState } from 'react';

/**
 * @description `value` 가 true 로 바뀔 때만 `delay` 만큼 늦춰 반영하고, false 는 즉시 반영한다
 *
 * 로딩 표시를 켜고 끄는 데 쓴다. 짧게 끝나는 작업에 표시가 번쩍이지 않도록 켜는 쪽만 늦추고,
 * 작업이 끝나면 곧바로 꺼야 이미 그려진 화면을 덮지 않는다.
 * @param value 늦춰서 켤 플래그
 * @param delay true 로 바뀌기까지 기다리는 밀리초
 * @returns 늦게 켜지고 즉시 꺼지는 플래그
 */
export default function useDelayedTrue(value: boolean, delay = 500): boolean {
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (!value) {
      setDelayed(false);
      return undefined;
    }

    const timer = setTimeout(() => setDelayed(true), delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return delayed;
}
