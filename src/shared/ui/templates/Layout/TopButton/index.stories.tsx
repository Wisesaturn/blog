import { MemoryRouter } from 'react-router';

import TopButton from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'shared/Layout/TopButton',
  component: TopButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TopButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/']}>
        <div className="h-screen" />
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};
