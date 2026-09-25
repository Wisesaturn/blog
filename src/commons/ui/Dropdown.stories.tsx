import Dropdown from './Dropdown';

import type { Meta, StoryObj } from '@storybook/react-vite';

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
