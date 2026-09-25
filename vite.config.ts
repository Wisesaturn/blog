import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * 클래식 컴파일러(esbuild)를 쓰던 시절에는 `remix.config.js` 의 `serverDependenciesToBundle` 에
 * micromark, mdast, hast 계열 ESM 패키지 120줄을 손으로 나열해야 했다. Vite 는 ESM 을 그대로
 * 다루므로 그 목록이 필요 없다. 서버 번들에 들어가야 하는 패키지가 생기면 `ssr.noExternal` 에 적는다.
 *
 * 라우트 규약과 빌드 동작은 `react-router.config.ts` 가 들고 있다. 이 파일은 Vite 쪽 설정만 둔다.
 *
 * alias 는 `tsconfig.paths.json` 하나를 `vite-tsconfig-paths` 가 읽어 쓴다. Storybook 과 Vitest 도 같은 파일을 읽는다.
 */
export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],

  /**
   * Vite 의 기동 시 의존성 스캔은 `index.html` 진입점을 따라가는데, React Router 는 라우트 단위라
   * 스캔이 닿지 않는 모듈이 남는다. 그대로 두면 브라우저가 그 모듈을 처음 요청할 때 Vite 가
   * 뒤늦게 최적화한 뒤 "optimized dependencies changed. reloading" 으로 페이지를 강제 새로고침한다.
   * 개발 중에 화면이 저절로 리로드되는 원인이라 여기에 미리 적어 둔다.
   *
   * 목록은 `node_modules/.vite` 를 비우고 개발 서버를 띄웠을 때 실제로 뒤늦게 잡힌 것들이다.
   * 의존성을 추가한 뒤 같은 로그가 다시 보이면 이 목록에 더한다.
   */
  optimizeDeps: {
    include: [
      '@giscus/react',
      '@vercel/analytics/react',
      '@vercel/speed-insights/react',
      'chalk',
      'firebase/app',
      'firebase/firestore',
      'firebase/functions',
      'firebase/storage',
      'motion/react',
    ],
  },
});
