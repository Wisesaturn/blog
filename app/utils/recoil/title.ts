import { atom, selector } from 'recoil';

export const titleState = atom<string>({
  key: 'titleState',
  default: '',
});

export const setTitleState = selector({
  key: 'setTitleState',
  get: ({ get }) => get(titleState),
  set: ({ set }, newTitleState) => {
    set(titleState, newTitleState as string);
  },
});
