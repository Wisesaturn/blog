import Input from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'shared/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
