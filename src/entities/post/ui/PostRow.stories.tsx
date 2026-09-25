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
  args: { ...DUMMY_POSTS[0] },
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
};
