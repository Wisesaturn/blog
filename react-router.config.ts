import type { Config } from '@react-router/dev/config';

/**
 * 라우트 규약과 빌드 동작을 정한다. Vite 쪽 설정은 `vite.config.ts` 에 있다.
 *
 * Remix 시절 `remix.config.js` 의 `ignoredRouteFiles` 는 여기 없다. React Router v7 은
 * `routes.ts` 로 라우트를 명시하거나 `@react-router/fs-routes` 로 파일 규약을 쓰는데,
 * 이 레포는 `app/routes/` 의 Remix v2 파일 규약을 그대로 쓰므로 `fs-routes` 를 붙였다.
 *
 * `ssr` 은 기본값 `true` 다. 정적 생성(#80)에서 `prerender` 를 더할 때도 이 값을 유지한다.
 * 조회수 갱신과 발행 엔드포인트가 `action` 을 쓰는데, `ssr: false` 면 `action` 을 둘 수 없다.
 */
export default {
  appDirectory: 'src/app',
} satisfies Config;
