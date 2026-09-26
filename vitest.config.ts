import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

/**
 * `*.spec.ts` 는 순수 함수를, `*.test.tsx` 는 컴포넌트를 본다.
 *
 * JSX 는 esbuild 의 automatic 런타임으로 처리한다. `@vitejs/plugin-react` 는 Fast Refresh 용이라
 * 테스트에 필요 없고, vitest 가 들고 오는 Vite 와 버전이 어긋나면 설정 로드 자체가 실패한다.
 *
 * alias 는 앱과 Storybook 처럼 `vite-tsconfig-paths` 로 `tsconfig.paths.json` 을 읽는다.
 */
export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  plugins: [tsconfigPaths()],
  test: {
    // .github/scripts 는 워크플로가 부르는 유틸이다 (#107)
    include: ['src/**/*.{test,spec}.{ts,tsx}', '.github/scripts/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/build/**', '**/storybook-static/**'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
