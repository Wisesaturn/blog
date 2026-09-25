import { withThemeByDataAttribute } from '@storybook/addon-themes';

import type { Preview } from '@storybook/react-vite';

import '@/commons/styles/global.css';

/**
 * 전역 decorator 로는 테마만 건다.
 *
 * 한때 `LayoutProvider` 도 여기서 모든 스토리에 씌웠는데, 그것이 `useLoading` 을 거쳐
 * `useNavigation` 을 부르는 바람에 데이터 라우터가 없는 Storybook 에서 모든 스토리가
 * "useNavigation must be used within a data router" 로 멈췄다.
 *
 * `LayoutProvider` 가 실제로 필요한 스토리는 Header 와 Layout 둘뿐이고 둘 다 자기 파일에서
 * 직접 감싸고 있다. 그래서 전역에서는 걷어냈다.
 */
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'color-theme',
    }),
  ],
};

export default preview;
