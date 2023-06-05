import { atom, selector } from 'recoil';

export type LoadingT = 'none' | 'loading' | 'empty';

export const EnvState = atom<{ [k in string]: string }>({
  key: 'EnvState',
  default: {},
});

export const setEnvState = selector<{ [k in string]: string }>({
  key: 'setEnvState',
  get: ({ get }) => get(EnvState),
  set: ({ set }, newEnvState) => set(EnvState, newEnvState),
});
