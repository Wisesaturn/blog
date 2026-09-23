/**
 * 클라이언트 하이드레이션 진입점.
 * https://reactrouter.com/api/framework-conventions/entry.client.tsx
 */
import { HydratedRouter } from 'react-router/dom';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});

// 기존 Service Worker 제거
// 기존 서비스 워커에 캐싱한 로직을 제거하면서 기존 사용자들이 서비스 워커를 자동으로 지우도록 개선한 코드입니다
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();

      // 기존에 등록된 모든 Service Worker 제거
      await Promise.all(
        registrations.map(async (registration) => {
          await registration.unregister();
          console.log('Service Worker unregistered:', registration.scope);
        }),
      );

      // 캐시도 함께 정리
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
        console.log('All caches cleared');
      }
    } catch (error) {
      console.error('Service Worker cleanup failed:', error);
    }
  });
}
