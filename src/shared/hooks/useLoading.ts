import { useNavigation } from 'react-router';

import useDelayedTrue from './useDelayedTrue';

/** 이 시간을 넘겨 이어지는 네비게이션에만 로딩 표시를 켠다. */
const LOADING_THRESHOLD_MS = 500;

/**
 * @description 네비게이션이 오래 이어질 때만 true 가 되는 로딩 플래그
 *
 * 이 값이 전체 화면 스피너를 띄운다. 예전에는 `useNavigation` 의 state 자체를 디바운스했는데,
 * 그 훅은 값을 억제하는 게 아니라 늦추기만 해서 끄는 것도 함께 늦어졌다. 화면이 다 그려진
 * 뒤에도 스피너가 500ms 를 더 덮고 있었고, 그게 화면이 깜빡이는 것처럼 보였다.
 * @returns 네비게이션이 500ms 넘게 이어지면 true
 */
export default function useLoading(): boolean {
  const { state } = useNavigation();
  return useDelayedTrue(state === 'loading' || state === 'submitting', LOADING_THRESHOLD_MS);
}
