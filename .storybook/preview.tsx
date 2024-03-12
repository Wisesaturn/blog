import React from 'react';
import type { Preview } from '@storybook/react';

import '$shared/styles/global.css';
import { MemoryRouter } from 'react-router'

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
    (Story) => (
      <Story />
    ),
  ],
};

export default preview;
