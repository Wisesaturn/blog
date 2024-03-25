import { MemoryRouter } from 'react-router';

import { LayoutProvider, DEFAULT_LAYOUT_VALUE } from '$shared/middleware/layout';
import { IHeader } from '$shared/types/layout';

import Header from './index';

import type { Meta, StoryObj } from '@storybook/react';

type HeaderPropsAndCustomArgs = React.ComponentProps<typeof Header> & IHeader;

const meta = {
  title: 'shared/layout/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  render: ({ ...args }) => (
    <LayoutProvider initialLayout={{ ...DEFAULT_LAYOUT_VALUE, header: args }}>
      <Header />
    </LayoutProvider>
  ),
  args: { title: '', category: '' },
} satisfies Meta<HeaderPropsAndCustomArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HasTitle: Story = {
  args: { title: 'useState 클로저', category: 'React' },
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};

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
