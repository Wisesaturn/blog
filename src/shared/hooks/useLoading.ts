import { useNavigation } from '@remix-run/react';

import useDebounce from './useDebounce';

/**
 * @summary 로딩 상태를 확인하는 hook
 */
export default function useLoading(): boolean {
  const { state } = useNavigation();
  const debouncedState = useDebounce(state, 500);
  return debouncedState === ('loading' || 'submitting');
}
