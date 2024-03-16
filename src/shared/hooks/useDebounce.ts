import { useEffect, useState } from 'react';

/**
 * @summary debounce hook
 * @param value
 * @param delay
 * @returns
 */
const useDebounce = <T>(value: T, delay = 200): T => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounceValue;
};

export default useDebounce;
