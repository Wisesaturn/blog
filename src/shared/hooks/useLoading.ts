import { useNavigation } from '@remix-run/react';

/**
 * @summary 로딩 상태를 확인하는 hook
 */
export default function useLoading(): boolean {
  const { state } = useNavigation();
  return state === ('loading' || 'submitting');
}
