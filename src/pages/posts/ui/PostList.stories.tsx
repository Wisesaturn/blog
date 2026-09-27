import { useMemo } from 'react';
import { createRoutesStub } from 'react-router';

import { DUMMY_POSTS } from '@/entities/post';

import PostList from './PostList';

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
 * `PostList` 안의 `PostRow` 가 `Link` 를, `PostFilter` 가 `useSearchParams` 를 쓴다.
 * 둘 다 라우터 컨텍스트를 요구하므로 스텁 라우터로 감싼다.
 *
 * 스토리가 바뀔 때만 스텁을 다시 만든다. 매 렌더마다 만들면 라우터 상태가 초기화된다.
 */
function WithRouterStub({ storyComponent }: { storyComponent: React.ComponentType }) {
  const Stub = useMemo(
    () => createRoutesStub([{ path: '/', Component: storyComponent }]),
    [storyComponent],
  );
  return <Stub initialEntries={['/']} />;
}

export const Default: Story = {
  args: { posts: DUMMY_POSTS, viewsFor: () => 120, viewsReady: true },
  decorators: [(StoryChildren) => <WithRouterStub storyComponent={StoryChildren} />],
};

/** 목록 통계를 받는 중이다. 조회수는 skeleton, 정렬 드롭다운의 조회수는 스피너로 보인다 */
export const LoadingViews: Story = {
  ...Default,
  args: { posts: DUMMY_POSTS, viewsFor: () => undefined, viewsReady: false },
};
