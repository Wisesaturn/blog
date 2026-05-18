import { type DependencyList, useCallback, useEffect, useRef } from 'react';

/**
 * @description useConditionalEffect의 async 지원 버전 — 조건을 만족할 때만 async effect를 실행
 *
 * @param effect async effect 함수 — cleanup 함수를 반환할 수 있음
 * @param deps 의존성 배열
 * @param condition (prevDeps, currentDeps) => boolean
 *  - 초기 렌더링 시 prevDeps는 undefined
 *  - true 반환 시 effect 실행, false 반환 시 스킵
 */
export function useAsyncConditionalEffect<T extends DependencyList>(
  effect: () => Promise<void | (() => void)>,
  deps: T,
  condition: (prevDeps: T | undefined, currentDeps: T) => boolean,
): void {
  const prevDepsRef = useRef<T | undefined>(undefined);
  const memoizedCondition = useCallback(condition, deps);

  if (deps.length === 0) {
    console.warn(
      'useAsyncConditionalEffect received an empty dependency array. ' +
        'This may indicate missing dependencies and could lead to unexpected behavior.',
    );
  }

  const shouldRun = memoizedCondition(prevDepsRef.current, deps);

  useEffect(() => {
    if (shouldRun) {
      let cleanup: (() => void) | void;

      effect().then((result) => {
        cleanup = result;
      });

      prevDepsRef.current = deps;

      return () => {
        cleanup?.();
      };
    }

    prevDepsRef.current = deps;
  }, deps);
}
