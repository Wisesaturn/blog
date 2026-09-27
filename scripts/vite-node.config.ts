import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * `scripts/` 의 일회성 스크립트를 vite-node 로 돌릴 때 쓰는 설정이다.
 *
 * 앱의 `vite.config.ts` 는 React Router 플러그인을 띄워서 스크립트에는 무겁다. alias(`@/*`)만 풀면 되므로
 * `vite-tsconfig-paths` 만 둔다.
 */
export default defineConfig({
  plugins: [tsconfigPaths()],
});
