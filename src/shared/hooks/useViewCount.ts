import { useEffect, useState } from 'react';

import { type ViewCountBody } from '$shared/api/viewCount';

/**
 * @description 조회수 API 를 한 번 부르고, 응답이 오면 그 값을 조회수로 쓴다
 *
 * 상세 페이지는 CDN 에 캐시되므로 loader 가 준 조회수는 캐시된 시점의 값이다. 화면을 그린 뒤
 * API 를 불러 조회수를 올리고, 돌아온 최신 값으로 바꾼다. 응답이 오기 전과 실패했을 때는
 * loader 값을 그대로 보여 준다.
 *
 * `useFetcher` 로 부르면 action 뒤에 화면의 loader 가 모두 다시 돌아 상세 loader 가 Firestore 를
 * 또 읽는다. 그래서 `fetch` 를 직접 쓴다.
 * @param url 조회수 API 경로
 * @param initialViews loader 가 준 조회수
 * @returns 지금 보여 줄 조회수
 */
export default function useViewCount(url: string, initialViews: number): number {
  const [fetched, setFetched] = useState<{ url: string; views: number } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { method: 'POST', signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<ViewCountBody>) : null))
      .then((body) => {
        if (body && typeof body.views === 'number') setFetched({ url, views: body.views });
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.warn('조회수를 갱신하지 못했습니다', err);
      });
    return () => controller.abort();
  }, [url]);

  // 다른 글로 이동하면 url 이 바뀐다. 이전 글의 응답은 쓰지 않는다
  return fetched?.url === url ? fetched.views : initialViews;
}
