import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, Badge, Card, HoverCard, Link, Stack, Text } from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = { title: 'Overlays & Utilities/HoverCard', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const HoverCardExample: Story = {
  name: 'HoverCard',
  render: () => (
    <DemoFrame
      title="Pointer profile preview"
      description="Hover over the @aisha mention to preview profile details without navigating away."
      code={`<HoverCard>
  <HoverCard.Trigger asChild><Link href="#aisha">@aisha</Link></HoverCard.Trigger>
  <HoverCard.Content>...</HoverCard.Content>
</HoverCard>`}
    >
      <Card variant="subtle" padding="sm" style={{ maxWidth: 520 }}>
        <Text size="sm">
          Design tokens review assigned to{' '}
          <HoverCard>
            <HoverCard.Trigger asChild>
              <Link href="#aisha">@aisha</Link>
            </HoverCard.Trigger>
            <HoverCard.Content>
              <Stack direction="row" gap={3}>
                <Avatar name="Aisha Rahman" />
                <Stack gap={1}>
                  <Stack direction="row" gap={2} align="center">
                    <Text weight="semibold">Aisha Rahman</Text>
                    <Badge size="sm" tone="accent">Lead</Badge>
                  </Stack>
                  <Text size="xs" tone="secondary">Product designer · Kuala Lumpur</Text>
                  <Text size="sm">Owns the design system and onboarding experience.</Text>
                </Stack>
              </Stack>
            </HoverCard.Content>
          </HoverCard>{' '}
          for the v0.3 release milestone.
        </Text>
      </Card>
    </DemoFrame>
  ),
};
