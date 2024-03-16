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

export const Normal: Story = {
  args: { inputType: 'normal', placeholder: 'answer the question' },
};

export const Search: Story = {
  args: {
    inputType: 'search',
    placeholder: 'answer the question',
    // eslint-disable-next-line no-alert
    handleSearch: (v: string) => alert(`Search Value : ${v}`),
  },
};

export const WithLabel: Story = {
  args: {
    inputType: 'normal',
    label: 'Label',
    placeholder: 'answer the question',
  },
};

export const WithDescription: Story = {
  args: {
    inputType: 'normal',
    placeholder: 'answer the question',
    description: 'This is a input component',
  },
};

export const SearchWithLabel: Story = {
  args: {
    inputType: 'search',
    label: 'Label',
    placeholder: 'answer the question',
    // eslint-disable-next-line no-alert
    handleSearch: (v: string) => alert(`Search Value : ${v}`),
  },
};
