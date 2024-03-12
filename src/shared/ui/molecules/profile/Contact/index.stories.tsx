import { MemoryRouter } from 'react-router';

import Contact from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Shared/profile/Contact',
  component: Contact,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (StoryChlidren) => (
      <MemoryRouter initialEntries={['/']}>
        <StoryChlidren />
      </MemoryRouter>
    ),
  ],
  args: {},
} satisfies Meta<typeof Contact>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
