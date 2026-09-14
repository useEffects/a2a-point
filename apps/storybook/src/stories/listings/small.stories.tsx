import { SmallListingCard } from 'app/components/cards/atoms/test';

import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof SmallListingCard> = {
  title: 'Cards/SmallListingCard',
  component: SmallListingCard,
};

export default meta;
type Story = StoryObj<typeof SmallListingCard>;

// Mock props for testing
const mockItem = {
  id: '123',
  title: 'Spacious 2BHK in Downtown',
  budget: 5000,
  deal_type: 'Rent',
  tags: ['Furnished', 'Sea View', 'Balcony'],
  date_created: new Date().toISOString(),
  price: 4800,
  user_created: {
    id: 'u1',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  location: {
    id: 'loc1',
    title: 'Dubai Marina',
    avatar: 'https://i.pravatar.cc/100?img=2',
  },
  saves: 15,
  views: 230,
};

export const Default: Story = {
  render: () => <SmallListingCard {...mockItem} />,
};
