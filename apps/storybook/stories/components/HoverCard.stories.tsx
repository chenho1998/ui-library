import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, HoverCard, Link, Stack, Text } from '@yourorg/ui';

const meta = { title: 'Overlays & Utilities/HoverCard', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const HoverCardExample: Story = {
  name: 'HoverCard',
  render: () => (
    <Text>
      Assigned to{' '}
      <HoverCard>
        <HoverCard.Trigger asChild>
          <Link href="#aisha">@aisha</Link>
        </HoverCard.Trigger>
        <HoverCard.Content>
          <Stack direction="row" gap={3}>
            <Avatar name="Aisha Rahman" />
            <Stack gap={1}>
              <Text weight="semibold">Aisha Rahman</Text>
              <Text size="sm" tone="secondary">Product designer · Kuala Lumpur</Text>
              <Text size="sm">Owns the design system and the onboarding flow.</Text>
            </Stack>
          </Stack>
        </HoverCard.Content>
      </HoverCard>
    </Text>
  ),
};
