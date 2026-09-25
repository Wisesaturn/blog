import { MemoryRouter } from 'react-router';

import TopButton from './TopButton';

import type { Meta, StoryObj } from '@storybook/react-vite';

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
