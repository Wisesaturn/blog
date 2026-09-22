import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { defineConfig } from 'vitest/config';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, 'src');

/**
 * `*.spec.ts` 는 순수 함수를, `*.test.tsx` 는 컴포넌트를 본다.
 *
 * JSX 는 esbuild 의 automatic 런타임으로 처리한다. `@vitejs/plugin-react` 는 Fast Refresh 용이라
 * 테스트에 필요 없고, vitest 가 들고 오는 Vite 와 버전이 어긋나면 설정 로드 자체가 실패한다.
 *
 * alias 는 `tsconfig.paths.json` 과 같은 값을 손으로 맞춘다. 둘이 갈라지면 테스트만 조용히
 * 모듈을 못 찾으므로, alias 를 추가할 때 두 파일을 함께 고친다.
 */
export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      '@': src,
      $app: path.join(src, 'app'),
      $features: path.join(src, 'features'),
      $pages: path.join(src, 'pages'),
      $shared: path.join(src, 'shared'),
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/build/**', '**/storybook-static/**'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
