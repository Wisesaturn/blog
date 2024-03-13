import Spinner from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'shared/indicator/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {},
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Full: Story = {
  args: {
    layout: 'full',
  },
};
