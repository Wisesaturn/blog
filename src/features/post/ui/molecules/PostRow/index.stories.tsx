import { MemoryRouter } from 'react-router';

import DUMMY_POSTS from '$features/post/constant/dummy';

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
  args: { ...DUMMY_POSTS[0] },
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};
