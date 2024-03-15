import { MemoryRouter } from 'react-router';

import { DEFAULT_MIDDLEWARE_VALUE } from '$shared/middleware/_index';

import NavigationBar from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'shared/layout/NavigationBar',
  component: NavigationBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof NavigationBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};

export const Posts: Story = {
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/posts']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};

export const Projects: Story = {
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/projects']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};

export const About: Story = {
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/about']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};
