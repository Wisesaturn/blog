import { MemoryRouter } from 'react-router';

import DUMMY_POSTS from '../config/dummy';
import PostRow from './PostRow';

import type { Meta, StoryObj } from '@storybook/react-vite';

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
  args: { ...DUMMY_POSTS[0], views: 1633, likes: 42 },
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};

/** 목록 통계를 받는 중이다. 조회수 자리에 skeleton 이 보인다 */
export const LoadingViews: Story = {
  ...Default,
  args: { ...DUMMY_POSTS[0], views: undefined, likes: undefined },
};

/** 목록 통계를 받지 못했다. 조회수 자리에 – 가 보인다 */
export const FailedViews: Story = {
  ...Default,
  args: { ...DUMMY_POSTS[0], views: null, likes: null },
};
