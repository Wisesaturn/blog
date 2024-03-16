import { MemoryRouter } from 'react-router';

import MiddlewareContext, { DEFAULT_MIDDLEWARE_VALUE } from '$shared/middleware/_index';
import { DEFAULT_LAYOUT_VALUE, LayoutProvider } from '$shared/middleware/layout';

import Layout from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'shared/Layout',
  component: Layout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <></>,
    data: { layout: DEFAULT_LAYOUT_VALUE, middleware: DEFAULT_MIDDLEWARE_VALUE },
  },
  decorators: [
    (StoryChlidren, props) => (
      <MiddlewareContext.Provider value={{ ...props.middleware }}>
        <LayoutProvider initialLayout={{ ...props.layout }}>
          <MemoryRouter initialEntries={['/']}>
            <StoryChlidren />
          </MemoryRouter>
        </LayoutProvider>
      </MiddlewareContext.Provider>
    ),
  ],
};
