import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';

/**
 * 앱과 같은 Vite 빌더를 쓴다. Tailwind 와 PostCSS 는 Vite 가 `postcss.config.js` 를 찾아
 * 처리하므로 addon 으로 따로 물릴 필요가 없다.
 *
 * 설정은 루트 `vite.config.ts` 대신 `.storybook/vite.config.ts` 를 쓴다. 이유는 그 파일에 적어 뒀다.
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['../public'],

  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-themes',
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: join(dirname(fileURLToPath(import.meta.url)), 'vite.config.ts'),
      },
    },
  },
};

export default config;
