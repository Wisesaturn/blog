import React from 'react';
import type { Preview } from '@storybook/react';
import { MemoryRouter } from 'react-router'

import '$shared/styles/global.css';
import '$shared/styles/tossface.css';

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
