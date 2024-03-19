/* eslint-disable no-restricted-syntax */
import { useCallback } from 'react';
import { useSearchParams } from '@remix-run/react';

/**
 * @summary URL Parameter에 특정 데이터를 추가 및 삭제하는 훅
 * @returns
 */
export default function useSelectedParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSelectedParams = useCallback(
    (key: string, value: string, isToggle = true) => {
      const keyParams = searchParams.get(key)?.split(',') || [];
      const isSelected = keyParams.includes(value);

      let updatedParams = [value];

      // Switch the data if it's toggle
      if (isToggle) {
        updatedParams = isSelected
          ? keyParams.filter((param) => param !== value)
          : keyParams.concat(value); // 기존 배열에 추가
      }

      // delete param if it's empty
      if (updatedParams[0]) {
        searchParams.set(key, updatedParams.toString());
      } else {
        searchParams.delete(key);
      }

      setSearchParams(searchParams, {
        preventScrollReset: true,
      });
    },
    [searchParams, setSearchParams],
  );

  return {
    searchParams,
    setSelectedParams: handleSelectedParams,
  };
}
