import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd, ScrollArea, Stack, Text } from '@yourorg/ui';

const meta = { title: 'Overlays & Utilities/Kbd & ScrollArea', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Utilities: Story = {
  name: 'Kbd and ScrollArea',
  render: () => (
    <Stack gap={6}>
      <Text>Save with <Kbd>⌘</Kbd><Kbd>S</Kbd>, or open the palette with <Kbd>Ctrl</Kbd><Kbd>K</Kbd>.</Text>
      <ScrollArea aria-label="Release notes" style={{ height: 180, maxWidth: 420, border: '1px solid var(--ui-color-border)', borderRadius: 12 }}>
        <Stack gap={3} style={{ padding: 16 }}>
          {Array.from({ length: 12 }, (_, i) => (
            <Text key={i} size="sm"><strong>v0.{12 - i}</strong> · Fixes and improvements to components, tokens and docs.</Text>
          ))}
        </Stack>
      </ScrollArea>
    </Stack>
  ),
};
