import { MemoryRouter } from 'react-router';

import LayoutContext, { DEFAULT_LAYOUT_VALUE } from '@/shared/middleware/layout';

import Header from './index';

import type { Meta, StoryObj } from '@storybook/react-vite';

type HeaderPropsAndCustomArgs = React.ComponentProps<typeof Header>;

const meta = {
  title: 'shared/layout/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  // `LayoutProvider` 는 `useLoading` 을 거쳐 `useNavigation` 을 부른다. 그 훅은 데이터 라우터를
  // 요구하는데 `MemoryRouter` 는 데이터 라우터가 아니라서 스토리가 멈춘다. 여기서는 헤더의 모습만
  // 보면 되므로 컨텍스트 값을 직접 넣는다.
  render: () => (
    <LayoutContext.Provider value={{ layout: DEFAULT_LAYOUT_VALUE, updateLayout: () => {} }}>
      <Header />
    </LayoutContext.Provider>
  ),
} satisfies Meta<HeaderPropsAndCustomArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};

export const About: Story = {
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/about']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};

export const Posts: Story = {
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/posts']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};

export const Projects: Story = {
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/projects']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};
