import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * 클래식 컴파일러(esbuild)를 쓰던 시절에는 `remix.config.js` 의 `serverDependenciesToBundle` 에
 * micromark, mdast, hast 계열 ESM 패키지 120줄을 손으로 나열해야 했다. Vite 는 ESM 을 그대로
 * 다루므로 그 목록이 필요 없다. 서버 번들에 들어가야 하는 패키지가 생기면 `ssr.noExternal` 에 적는다.
 *
 * alias 는 `tsconfig.paths.json` 하나를 `vite-tsconfig-paths` 가 읽어 쓴다. 다만 `vitest.config.ts`
 * 는 여전히 같은 값을 손으로 들고 있으므로, alias 를 추가할 때 두 파일을 함께 고친다.
 */
export default defineConfig({
  plugins: [
    remix({
      appDirectory: 'src/app',
      ignoredRouteFiles: ['**/*.css', '**/*.ts', '**/*.stories.ts', '**/*.stories.tsx', '**/*.js'],
    }),
    tsconfigPaths(),
  ],
});
