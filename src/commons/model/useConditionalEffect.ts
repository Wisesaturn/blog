import { type DependencyList, type EffectCallback, useCallback, useEffect, useRef } from 'react';

/**
 * @description useEffect를 좀 더 효과적으로 제어할 수 있는 훅
 * @reference https://github.com/toss/react-simplikit/blob/main/src/hooks/useConditionalEffect/useConditionalEffect.ts
 *
 * @param effect 실행할 effect 콜백 (async는 내부에서 IIFE로 감싸야 함)
 * @param deps 의존성 배열
 * @param condition (prevDeps, currentDeps) => boolean
 *  - 초기 렌더링 시 prevDeps는 undefined
 *  - true 반환 시 effect 실행, false 반환 시 스킵
 */
export function useConditionalEffect<T extends DependencyList>(
  effect: EffectCallback,
  deps: T,
  condition: (prevDeps: T | undefined, currentDeps: T) => boolean,
): void {
  const prevDepsRef = useRef<T | undefined>(undefined);
  const memoizedCondition = useCallback(condition, deps);

  if (deps.length === 0) {
    console.warn(
      'useConditionalEffect received an empty dependency array. ' +
        'This may indicate missing dependencies and could lead to unexpected behavior.',
    );
  }

  const shouldRun = memoizedCondition(prevDepsRef.current, deps);

  useEffect(() => {
    if (shouldRun) {
      const cleanup = effect();
      prevDepsRef.current = deps;
      return cleanup;
    }

    prevDepsRef.current = deps;
  }, deps);
}
