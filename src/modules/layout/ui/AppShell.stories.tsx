import { useMemo } from 'react';
import { createRoutesStub } from 'react-router';

import { DEFAULT_LAYOUT_VALUE } from '@/commons/model/layout';

import AppShell from './AppShell';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'modules/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `AppShell` 안의 `LayoutProvider` 가 `useNavigation` 을 부르고 헤더가 `Link` 를 쓴다.
 * `MemoryRouter` 로는 `useNavigation` 을 채울 수 없어서 `createRoutesStub` 으로 라우터를 세운다.
 *
 * 예전 `Layout` 스토리는 `<html>` 부터 그려서 `validateDOMNesting` 경고가 남았다. 문서 셸을 app 의
 * `Document` 로 떼어 낸 뒤로는 본문 셸만 그리므로 경고가 없다.
 */
function WithRouterStub({ storyComponent }: { storyComponent: React.ComponentType }) {
  const Stub = useMemo(
    () => createRoutesStub([{ path: '/', Component: storyComponent }]),
    [storyComponent],
  );
  return <Stub initialEntries={['/']} />;
}

export const Default: Story = {
  args: {
    children: <main className="p-8">본문</main>,
    layout: DEFAULT_LAYOUT_VALUE,
  },
  decorators: [(StoryChildren) => <WithRouterStub storyComponent={StoryChildren} />],
};
