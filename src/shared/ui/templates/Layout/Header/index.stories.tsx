import { MemoryRouter } from 'react-router';

import Header from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Shared/layout/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof Header>;

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

export const About: Story = {
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/about']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};

export const Post: Story = {
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/post']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};

export const Project: Story = {
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/project']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};
