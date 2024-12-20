import type { Meta, StoryObj } from '@storybook/react';
import SiteChoices from './index';

const meta: Meta<typeof SiteChoices> = {
  title: 'Universal/SiteChoices',
  component: SiteChoices,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SiteChoices>;

// Basic story with default props
export const Default: Story = {};
