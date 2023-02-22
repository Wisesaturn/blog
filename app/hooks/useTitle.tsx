import { useRecoilState } from 'recoil';
import { setTitleState } from '@utils/recoil/title';
import { useCallback } from 'react';

export default function useTitle() {
  const [title, setTitle] = useRecoilState(setTitleState);

  const changeTitle = useCallback(
    (input: string) => {
      setTitle(input);
    },
    [setTitle],
  );

  return { title, changeTitle };
}
