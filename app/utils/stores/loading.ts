import { atom, selector } from 'recoil';

type LoadingT = 'none' | 'loading';

export const loadingState = atom<LoadingT>({
  key: 'loadingState',
  default: 'none',
});

export const setLoadingState = selector<LoadingT>({
  key: 'setLoadingState',
  get: ({ get }) => get(loadingState),
  set: ({ set }, newLoadingState) => set(loadingState, newLoadingState),
});
