import { useMemo } from 'react';
import { createRemixStub } from '@remix-run/testing';

import DUMMY_POSTS from '$features/post/constant/dummy';

import PostList from '.';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'features/post/PostList',
  component: PostList,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof PostList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `PostList` 는 Remix 의 `Await` 로 posts 프로미스를 푼다. `Await` 는 데이터 라우터 안에서만
 * 동작하므로 `MemoryRouter` 로는 부족하고, `createRemixStub` 이 만드는 라우터가 필요하다.
 *
 * 스토리가 바뀔 때만 스텁을 다시 만든다. 매 렌더마다 만들면 라우터 상태가 초기화된다.
 */
function WithRemixStub({ storyComponent }: { storyComponent: React.ComponentType }) {
  const Stub = useMemo(
    () => createRemixStub([{ path: '/', Component: storyComponent }]),
    [storyComponent],
  );
  return <Stub initialEntries={['/']} />;
}

export const Default: Story = {
  args: { posts: Promise.resolve(DUMMY_POSTS) },
  decorators: [(StoryChildren) => <WithRemixStub storyComponent={StoryChildren} />],
};
