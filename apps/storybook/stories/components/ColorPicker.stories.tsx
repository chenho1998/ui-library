import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Alert, Avatar, Badge, Button, Card, ColorPicker, Grid, Heading, Progress, Stack, Switch, Text, ThemeProvider,
  createTheme, useTheme,
} from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = {
  title: 'Components/Forms/ColorPicker',
  component: ColorPicker,
  tags: ['new'],
  args: {
    label: 'Brand colour',
    defaultValue: '#7c3aed',
    size: 'md',
    disabled: false,
    hint: 'Pick a swatch, drag the area or type a hex code.',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Accessible hex colour picker with a 2D saturation/brightness area, hue slider, hex input and preset swatches.',
      },
    },
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <DemoFrame
      title="ColorPicker playground"
      description="Click the colour swatch to open the 2D saturation/brightness plane, hue slider and presets."
      maxWidth={560}
      code={`<ColorPicker label="Brand colour" defaultValue="#7c3aed" />`}
    >
      <div style={{ maxWidth: 320 }}>
        <ColorPicker {...args} />
      </div>
    </DemoFrame>
  ),
};

const brandPresets = [
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Teal', hex: '#0d9488' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Emerald', hex: '#059669' },
];

export const LiveThemePreview: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const { colorScheme } = useTheme();
    const [brand, setBrand] = React.useState('#7c3aed');
    const [autoDeploy, setAutoDeploy] = React.useState(true);
    const customTheme = React.useMemo(() => createTheme({ brand }), [brand]);

    return (
      <DemoFrame
        title="Live brand theme studio"
        description="Generate a full accessible OKLCH accent scale from a single hex colour via createTheme({ brand })."
        badge={brand.toUpperCase()}
        maxWidth={920}
        code={`const theme = createTheme({ brand: '${brand}' });\n<ThemeProvider theme={theme}>...</ThemeProvider>`}
      >
        <Grid minChildWidth="280px" gap={6} style={{ alignItems: 'start' }}>
          <Stack gap={4}>
            <ColorPicker
              label="Primary brand accent"
              hint="Click the swatch to fine-tune saturation and hue, or choose a preset below."
              value={brand}
              onValueChange={setBrand}
            />
            <Stack gap={2}>
              <Text size="xs" weight="semibold" tone="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Quick presets
              </Text>
              <Stack direction="row" gap={2} wrap>
                {brandPresets.map((preset) => {
                  const active = brand.toLowerCase() === preset.hex;
                  return (
                    <Button
                      key={preset.hex}
                      size="sm"
                      variant={active ? 'solid' : 'outline'}
                      tone={active ? 'accent' : 'neutral'}
                      onClick={() => setBrand(preset.hex)}
                      startIcon={
                        <span
                          aria-hidden="true"
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: preset.hex,
                            border: active ? '1.5px solid #fff' : '1px solid rgba(0,0,0,0.2)',
                          }}
                        />
                      }
                    >
                      {preset.name}
                    </Button>
                  );
                })}
              </Stack>
            </Stack>
            <code
              style={{
                display: 'block',
                padding: '10px 12px',
                borderRadius: 8,
                background: 'var(--ui-color-surface)',
                border: '1px solid var(--ui-color-border)',
                fontFamily: 'var(--ui-font-mono)',
                fontSize: 12,
                color: 'var(--ui-color-text-secondary)',
              }}
            >
              {`createTheme({ brand: '${brand}' })`}
            </code>
          </Stack>

          <ThemeProvider
            theme={customTheme}
            colorScheme={colorScheme}
            style={{
              padding: 20,
              borderRadius: 12,
              border: '1px solid var(--ui-color-border)',
              background: 'var(--ui-color-surface)',
            }}
          >
            <Card variant="subtle" padding="md">
              <Stack gap={4}>
                <Stack direction="row" justify="between" align="center" gap={2}>
                  <Stack direction="row" gap={2} align="center">
                    <Avatar name="Aisha Rahman" size="sm" />
                    <div>
                      <Heading level={3} size="md">Acme Workspace</Heading>
                      <Text size="xs" tone="secondary">OKLCH accent · {brand.toUpperCase()}</Text>
                    </div>
                  </Stack>
                  <Badge tone="accent">Pro plan</Badge>
                </Stack>
                <Progress label="Quarterly rollout" value={74} showValue />
                <Switch
                  label="Auto-publish design tokens"
                  checked={autoDeploy}
                  onCheckedChange={setAutoDeploy}
                />
                <Alert tone="info" title="Contrast guaranteed">
                  Text-on-accent and focus rings automatically adapt to WCAG AA.
                </Alert>
                <Stack direction="row" gap={2} wrap>
                  <Button size="sm">Publish theme</Button>
                  <Button size="sm" variant="outline">Preview</Button>
                  <Button size="sm" variant="ghost">Reset</Button>
                </Stack>
              </Stack>
            </Card>
          </ThemeProvider>
        </Grid>
      </DemoFrame>
    );
  },
};
