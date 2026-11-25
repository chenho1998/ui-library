import type { Meta, StoryObj } from '@storybook/react-vite';
import { tokens, STEPS } from '@yourorg/tokens';
import { Grid, Heading, Stack, Text } from '@yourorg/ui';

const meta = {
  title: 'Foundations/Tokens',
  parameters: { controls: { disable: true }, a11y: { test: 'off' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const Swatch = ({ name, varName }: { name: string; varName: string }) => (
  <Stack gap={1}>
    <div style={{ height: 48, borderRadius: 8, background: `var(${varName})`, border: '1px solid var(--ui-color-border)' }} />
    <Text size="xs" weight="medium">{name}</Text>
    <Text size="xs" tone="secondary" style={{ fontFamily: 'var(--ui-font-mono)' }}>{varName}</Text>
  </Stack>
);

export const SemanticColors: Story = {
  render: () => (
    <Stack gap={4}>
      <Text tone="secondary">Components only use these. Switch the Scheme and Brand toolbars to see them remap.</Text>
      <Grid minChildWidth="150px" gap={4}>
        {Object.keys(tokens.color.light).map((k) => <Swatch key={k} name={k} varName={`--ui-color-${k}`} />)}
      </Grid>
    </Stack>
  ),
};

export const Palettes: Story = {
  render: () => (
    <Stack gap={5}>
      {Object.keys(tokens.palette).map((p) => (
        <Stack key={p} gap={2}>
          <Heading level={3} size="md">{p}</Heading>
          <Grid columns={11} gap={2}>
            {STEPS.map((s) => <Swatch key={s} name={String(s)} varName={`--ui-${p}-${s}`} />)}
          </Grid>
        </Stack>
      ))}
    </Stack>
  ),
};

export const Typography: Story = {
  render: () => (
    <Stack gap={3}>
      {Object.entries(tokens.font.size).reverse().map(([k, [size, lh]]) => (
        <Stack key={k} direction="row" gap={6} align="baseline">
          <Text size="xs" tone="secondary" style={{ width: 120, fontFamily: 'var(--ui-font-mono)' }}>text-{k} · {size}/{lh}</Text>
          <Text size={k as never}>Build interfaces people trust</Text>
        </Stack>
      ))}
    </Stack>
  ),
};

export const SpacingRadiusShadow: Story = {
  render: () => (
    <Stack gap={8}>
      <Stack gap={2}>
        {Object.entries(tokens.space).filter(([k]) => k !== '0').map(([k, v]) => (
          <Stack key={k} direction="row" gap={4} align="center">
            <Text size="xs" tone="secondary" style={{ width: 90, fontFamily: 'var(--ui-font-mono)' }}>space-{k} · {v}</Text>
            <div style={{ width: v, height: 12, background: 'var(--ui-color-accent)', borderRadius: 2 }} />
          </Stack>
        ))}
      </Stack>
      <Stack direction="row" gap={4} wrap>
        {Object.keys(tokens.radius).map((k) => (
          <Stack key={k} gap={1} align="center">
            <div style={{ width: 64, height: 64, background: 'var(--ui-color-accent-subtle)', border: '2px solid var(--ui-color-accent)', borderRadius: `var(--ui-radius-${k})` }} />
            <Text size="xs">radius-{k}</Text>
          </Stack>
        ))}
      </Stack>
      <Stack direction="row" gap={6} wrap>
        {Object.keys(tokens.shadow).map((k) => (
          <Stack key={k} gap={2} align="center">
            <div style={{ width: 96, height: 64, background: 'var(--ui-color-surface)', borderRadius: 8, boxShadow: `var(--ui-shadow-${k})` }} />
            <Text size="xs">shadow-{k}</Text>
          </Stack>
        ))}
      </Stack>
    </Stack>
  ),
};
