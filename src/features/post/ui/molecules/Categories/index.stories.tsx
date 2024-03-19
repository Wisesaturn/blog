import { MemoryRouter } from 'react-router';

import Categories from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'features/post/Categories',
  component: Categories,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Categories>;

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
