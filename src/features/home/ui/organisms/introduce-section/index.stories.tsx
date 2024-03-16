import IntroduceSection from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'features/home/section/Introduce',
  component: IntroduceSection,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof IntroduceSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Introduce: Story = {};
