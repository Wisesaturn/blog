/* eslint-disable no-restricted-syntax */
import { useSearchParams } from '@remix-run/react';
import { useCallback } from 'react';

/**
 * @summary URL Parameter에 특정 데이터를 추가 및 삭제하는 훅
 * @dsecription isToggle로 토글 여부를 결정합니다
 * @returns
 */
export default function useUrlParamsUpdater() {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * key-value를 입력하고, 토글 여부를 전달합니다
   */
  const handleSelectedParams = useCallback(
    (key: string, value: string, isToggle = true) => {
      const keyParams = searchParams.get(key)?.split(',') || [];
      const isSelected = keyParams.includes(value);

      let updatedParams = [value];

      // Switch the data if it's toggle
      if (isToggle) {
        updatedParams = isSelected
          ? keyParams.filter((param) => param !== value)
          : keyParams.concat(value);
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
