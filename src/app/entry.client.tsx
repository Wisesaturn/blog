/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */
import { RemixBrowser } from '@remix-run/react';
import { Analytics } from '@vercel/analytics/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
      <Analytics />
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
