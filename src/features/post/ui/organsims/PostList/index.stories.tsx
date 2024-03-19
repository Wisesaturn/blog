import { MemoryRouter } from 'react-router';

import DUMMY_POSTS from '$features/post/constant/dummy';

import PostList from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'features/post/PostList',
  component: PostList,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof PostList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { posts: DUMMY_POSTS },
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};
