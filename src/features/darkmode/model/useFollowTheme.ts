import { useEffect } from 'react';

import {
  SYSTEM_DARK_QUERY,
  THEME_STORAGE_KEY,
  applyTheme,
  getStoredTheme,
  resolveTheme,
} from '@/commons/lib/theme';

/**
 * @description 페이지를 연 채로 바뀐 테마 설정을 따라간다.
 * - 직접 고른 값이 없으면 시스템 설정이 바뀔 때 따라 바꾼다
 * - 다른 탭에서 고른 값이 바뀌면 이 탭에도 적용한다
 */
export default function useFollowTheme() {
  useEffect(function followSystemAndOtherTabs() {
    const media = window.matchMedia(SYSTEM_DARK_QUERY);

    const onSystemChange = () => {
      if (getStoredTheme() === null) applyTheme(resolveTheme());
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY || event.key === null) applyTheme(resolveTheme());
    };

    media.addEventListener('change', onSystemChange);
    window.addEventListener('storage', onStorage);
    return () => {
      media.removeEventListener('change', onSystemChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
}
