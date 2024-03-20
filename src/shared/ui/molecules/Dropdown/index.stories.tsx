import Dropdown from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'shared/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    label: 'Dropdown',
    items: ['menu1', 'menu2', 'menu3'],
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
