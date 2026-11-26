import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Grid, Kbd, ScrollArea, Stack, Text } from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = { title: 'Overlays & Utilities/Kbd & ScrollArea', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const shortcuts = [
  { keys: ['⌘', 'K'], label: 'Open command palette' },
  { keys: ['⌘', 'S'], label: 'Save draft' },
  { keys: ['Shift', 'F10'], label: 'Open context menu' },
  { keys: ['Esc'], label: 'Dismiss active overlay' },
];

export const Utilities: Story = {
  name: 'Kbd and ScrollArea',
  render: () => (
    <DemoFrame
      title="Keycaps & custom ScrollArea"
      description="Semantic <kbd> shortcut hints alongside a lightweight native thin-scrollbar ScrollArea."
      code={`<Text>Open palette with <Kbd>⌘</Kbd><Kbd>K</Kbd></Text>
<ScrollArea aria-label="Release notes" style={{ height: 180 }}>...</ScrollArea>`}
    >
      <Grid minChildWidth="260px" gap={6} style={{ alignItems: 'start' }}>
        <Stack gap={3}>
          <Text size="xs" weight="semibold" tone="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Keyboard keycaps
          </Text>
          <Stack gap={2}>
            {shortcuts.map((s) => (
              <Stack key={s.label} direction="row" justify="between" align="center" gap={3} style={{ padding: '6px 10px', borderRadius: 8, background: 'var(--ui-color-surface-subtle)' }}>
                <Text size="sm">{s.label}</Text>
                <Stack direction="row" gap={1}>{s.keys.map((k) => <Kbd key={k}>{k}</Kbd>)}</Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
        <Stack gap={3}>
          <Text size="xs" weight="semibold" tone="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Scrollable release log
          </Text>
          <ScrollArea aria-label="Release notes" style={{ height: 184, border: '1px solid var(--ui-color-border)', borderRadius: 10 }}>
            <Stack gap={3} style={{ padding: 14 }}>
              {Array.from({ length: 10 }, (_, i) => (
                <Stack key={i} direction="row" gap={2} align="center">
                  <Badge size="sm" tone={i === 0 ? 'accent' : 'neutral'}>v0.{10 - i}</Badge>
                  <Text size="sm" tone="secondary">Accessibility, token contrast and component updates.</Text>
                </Stack>
              ))}
            </Stack>
          </ScrollArea>
        </Stack>
      </Grid>
    </DemoFrame>
  ),
};
