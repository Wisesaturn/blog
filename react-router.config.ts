import { createServer } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import type { Config } from '@react-router/dev/config';
import type getContentPathsFn from './src/shared/api/getContentPaths';

/**
 * 경로 목록을 앱 코드의 `getContentPaths` 로 만든다.
 *
 * 이 설정 파일은 앱과 다른 로더로 읽혀서 `$features` 같은 alias 가 풀리지 않는다. 그래서 여기서만
 * Vite 를 잠깐 띄워 `vite-tsconfig-paths` 로 alias 를 풀고 모듈을 불러온 뒤 바로 닫는다.
 * 앱 코드를 상대경로 import 로 바꾸지 않으려고 이렇게 했다.
 */
async function loadContentPaths(): ReturnType<typeof getContentPathsFn> {
  const server = await createServer({
    configFile: false,
    plugins: [tsconfigPaths()],
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
    logLevel: 'error',
    // 이 서버는 `ssrLoadModule` 만 쓰므로 브라우저용 의존성 최적화가 필요 없다. 끄지 않으면 개발 서버와
    // 같은 `node_modules/.vite` 를 쓰면서 첫 요청 때 최적화 결과를 빈 것으로 덮어쓴다. 그러면 개발 서버가
    // 이미 참조한 `react.js` 등이 사라져 504 (Outdated Optimize Dep) 가 나고 하이드레이션이 되지 않는다.
    cacheDir: 'node_modules/.vite-prerender',
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const mod = await server.ssrLoadModule('/src/shared/api/getContentPaths.ts');
    return await (mod.default as typeof getContentPathsFn)();
  } finally {
    await server.close();
  }
}

/**
 * 라우트 규약과 빌드 동작을 정한다. Vite 쪽 설정은 `vite.config.ts` 에 있다.
 *
 * Remix 시절 `remix.config.js` 의 `ignoredRouteFiles` 는 여기 없다. React Router v7 은
 * `routes.ts` 로 라우트를 명시하거나 `@react-router/fs-routes` 로 파일 규약을 쓰는데,
 * 이 레포는 `app/routes/` 의 Remix v2 파일 규약을 그대로 쓰므로 `fs-routes` 를 붙였다.
 *
 * `ssr` 은 기본값 `true` 다. 조회수 API 와 발행 엔드포인트가 `action` 을 쓰는데, `ssr: false` 면
 * `action` 을 둘 수 없다. `prerender` 목록에 없는 경로(빌드 뒤에 발행한 글 등)도 SSR 로 열린다.
 */
export default {
  appDirectory: 'src/app',

  /**
   * 글과 프로젝트, 스니펫의 상세 페이지만 빌드 때 HTML 로 굽는다. 경로는 sitemap 과 같은 함수로 만든다.
   *
   * 목록 페이지는 굽지 않는다. 목록은 쿼리스트링(`?category=react`)으로 필터링하는데, 정적 파일은
   * 쿼리를 무시하고 같은 HTML 을 돌려주므로 필터가 적용되지 않은 목록이 나간다.
   */
  async prerender() {
    const { posts, projects, snippets } = await loadContentPaths();
    return [...posts, ...projects, ...snippets].map(({ path }) => path);
  },
} satisfies Config;
