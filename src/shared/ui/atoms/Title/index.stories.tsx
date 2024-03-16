import { FADE_IN_UP_ITEM } from '$shared/constant/animation';

import Title from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'shared/Title',
  component: Title,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'This is Title', subtitle: 'This is subtitle for explanation pages' },
};
