/**
 * 페이지 응답의 `Cache-Control`. 라우트는 loader 의 `data()` 에 이 값을 넣고 `headers` export 로 응답에 싣는다.
 *
 * 규칙은 두 가지다.
 * - 상세는 빌드 때 굽고(`prerender`), 구운 목록에 없는 새 글이 SSR 로 열릴 때만 이 헤더가 쓰인다.
 *   본문은 발행 시점에 정해지고 발행하면 Deploy Hook 으로 다시 굽으므로 하루를 둔다
 * - 목록은 굽지 않고 CDN 에 맡긴다. 목록에서 발행 뒤에도 바뀌는 값은 조회수뿐이라 10분 늦어도 된다
 *
 * `s-maxage` 가 없으면 Vercel 이 캐시하지 않는다. `stale-while-revalidate` 는 만료 뒤 첫 요청에도
 * 예전 응답을 바로 주고 뒤에서 갱신하게 한다. Vercel 은 두 값을 CDN 에서 쓰고 브라우저에는 떼어 보낸다.
 */
export const DETAIL_CACHE_CONTROL = 'public, s-maxage=86400, stale-while-revalidate=31556952';

export const LIST_CACHE_CONTROL = 'public, s-maxage=600, stale-while-revalidate=31556952';
