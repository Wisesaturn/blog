import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Storybook 전용 Vite 설정이다. 루트 `vite.config.ts` 를 쓰지 않는 이유는 그 파일의 React Router
 * 플러그인 때문이다. 이 플러그인은 라우트 규약과 SSR 엔트리를 요구해서 Storybook 이 로드하면
 * "The React Router Vite plugin requires the use of a Vite config file" 로 멈춘다.
 *
 * `viteFinal` 에서 걷어내는 방법은 빌드에서만 통한다. 개발 서버는 `getOptimizeDeps` 가
 * `viteFinal` 을 거치지 않고 설정을 따로 resolve 해서 같은 자리에서 다시 멈춘다.
 *
 * alias 는 루트와 마찬가지로 `tsconfig.paths.json` 하나를 읽어 해결한다. Tailwind 는 루트와 같은
 * `@tailwindcss/vite` 플러그인을 여기에도 넣는다. 루트 설정을 읽지 않으므로 빠뜨리면 스토리에 스타일이 없다.
 */
export default defineConfig({
  plugins: [tailwindcss(), tsconfigPaths()],
});
