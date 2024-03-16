import Categories from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'features/post/Categories',
  component: Categories,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Categories>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
