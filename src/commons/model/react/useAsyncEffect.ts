import { type DependencyList, useEffect } from 'react';

/**
 * @description useEffect 내에서 비동기 처리를 위한 훅
 * @reference https://github.com/toss/react-simplikit/blob/main/src/hooks/useAsyncEffect/useAsyncEffect.ts
 *
 * @param effect async effect 함수 — cleanup 함수를 반환할 수 있음
 * @param deps 의존성 배열
 */
export function useAsyncEffect(
  effect: () => Promise<void | (() => void)>,
  deps?: DependencyList,
): void {
  useEffect(() => {
    let cleanup: (() => void) | void;

    effect().then((result) => {
      cleanup = result;
    });

    return () => {
      cleanup?.();
    };
  }, deps);
}
