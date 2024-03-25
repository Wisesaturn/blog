import { useNavigation } from '@remix-run/react';
import { useEffect } from 'react';

import useDebounce from './useDebounce';

/**
 * @summary 로딩 상태를 확인하는 hook
 */
export default function useLoading(): boolean {
  const { state } = useNavigation();

  useEffect(() => {
    console.log(state);
  }, [state]);
  const debouncedState = useDebounce(state, 500);
  return debouncedState === ('loading' || 'submitting');
}
