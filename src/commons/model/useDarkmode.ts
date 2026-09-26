import { useSyncExternalStore } from 'react';

import { getDocumentTheme, subscribeDocumentTheme } from '@/commons/lib/theme';
import { type Darkmode } from '@/commons/types/layout';

/**
 * @description 지금 문서에 적용된 테마를 읽는 훅. `<html color-theme>` 가 바뀌면 다시 렌더한다.
 *
 * 서버는 테마를 모르므로 서버 스냅샷은 `light` 다. 하이드레이션할 때는 서버 스냅샷을 쓰고,
 * 끝난 뒤 실제 값으로 다시 렌더하므로 하이드레이션 불일치가 나지 않는다.
 * @returns 'dark' | 'light'
 */
export default function useDarkmode(): Darkmode {
  return useSyncExternalStore(subscribeDocumentTheme, getDocumentTheme, () => 'light');
}
