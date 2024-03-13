import { MemoryRouter } from 'react-router';

import Copyright from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'shared/layout/Copyright',
  component: Copyright,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Copyright>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};
