import type { Meta, StoryObj } from '@storybook/react-vite';
import { Rating, Stack, toast } from '@yourorg/ui';

const meta = { title: 'Inputs & Actions/Rating', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const RatingExample: Story = {
  name: 'Rating',
  render: () => (
    <Stack gap={6}>
      <Rating label="How was your stay?" defaultValue={4} onValueChange={(v) => toast({ title: `Rated ${v}` })} />
      <Rating label="Average rating" value={3} readOnly size="sm" />
    </Stack>
  ),
};
