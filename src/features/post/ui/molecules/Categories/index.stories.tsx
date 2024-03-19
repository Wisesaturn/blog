import { MemoryRouter } from 'react-router';

import useSelectedParams from '$features/post/hooks/useSelectedParams';

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

const args = useSelectedParams();

export const Default: Story = {
  args,
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};
