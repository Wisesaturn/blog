import { useMemo } from 'react';
import { createRoutesStub } from 'react-router';

import { DEFAULT_MIDDLEWARE_VALUE } from '@/shared/middleware/_index';

import { DEFAULT_LAYOUT_VALUE } from '@/commons/model/layout';

import Layout from './index';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'shared/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `Layout` 은 `<html>` 부터 통째로 그리는 문서 루트라 Remix 의 `Meta`, `Links`, `Scripts`,
 * `ScrollRestoration` 을 쓰고, 내부 `LayoutProvider` 가 `useNavigation` 까지 부른다.
 * `MemoryRouter` 로는 어느 것도 채울 수 없어서 `createRoutesStub` 으로 라우터와 Remix 컨텍스트를
 * 함께 세운다.
 *
 * `MiddlewareContext` 와 `LayoutProvider` 는 `Layout` 이 안에서 직접 감싸므로 여기서 또 씌우지 않는다.
 *
 * Storybook 이 컨테이너 `div` 안에 렌더하므로 `<html>` 중첩을 알리는 `validateDOMNesting` 경고가
 * 콘솔에 남는다. 렌더 자체는 정상이고, 없애려면 문서 셸과 본문 셸을 쪼개야 한다.
 */
function WithRemixStub({ storyComponent }: { storyComponent: React.ComponentType }) {
  const Stub = useMemo(
    () => createRoutesStub([{ path: '/', Component: storyComponent }]),
    [storyComponent],
  );
  return <Stub initialEntries={['/']} />;
}

export const Default: Story = {
  args: {
    children: <></>,
    data: { layout: DEFAULT_LAYOUT_VALUE, middleware: DEFAULT_MIDDLEWARE_VALUE },
  },
  decorators: [(StoryChildren) => <WithRemixStub storyComponent={StoryChildren} />],
};
