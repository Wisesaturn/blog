import React from 'react';
import type { Preview } from '@storybook/react';
import { DEFAULT_LAYOUT_VALUE, LayoutProvider } from '../src/shared/middleware/layout';

import '$shared/styles/global.css';
import '$shared/styles/etc/tossface.css';

import { withThemeByDataAttribute } from '@storybook/addon-themes';

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
    (Story) => {
      return (
        <LayoutProvider initialLayout={{ ...DEFAULT_LAYOUT_VALUE }}>
          <Story />
        </LayoutProvider>
      );
    },
  ],
};

export default preview;
