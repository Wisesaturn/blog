import { MemoryRouter } from 'react-router';

import PostRow from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'features/post/PostRow',
  component: PostRow,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof PostRow>;

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
