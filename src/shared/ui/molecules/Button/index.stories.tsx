import Icons from '$shared/ui/atoms/icons';

import Button from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'shared/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: { onClick: () => alert('click!') },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    children: <Button.Text>Button</Button.Text>,
  },
};

export const Icon: Story = {
  args: {
    children: (
      <Button.Icon>
        <Icons.Cancel />
      </Button.Icon>
    ),
  },
};

export const TextWithIcon: Story = {
  args: {
    children: (
      <>
        <Button.Icon>
          <Icons.Cancel />
        </Button.Icon>
        <Button.Text>Button</Button.Text>
      </>
    ),
  },
};
