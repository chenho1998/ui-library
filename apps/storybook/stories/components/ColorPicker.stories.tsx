import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Button, Card, ColorPicker, Stack, Text, ThemeProvider, createTheme } from '@yourorg/ui';

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
    <div style={{ maxWidth: 320 }}>
      <ColorPicker {...args} />
    </div>
  ),
};

export const LiveThemePreview: Story = {
  render: function Render() {
    const [brand, setBrand] = React.useState('#7c3aed');
    const customTheme = React.useMemo(() => createTheme({ brand }), [brand]);
    return (
      <Stack gap={4} style={{ maxWidth: 420 }}>
        <ColorPicker label="Live brand accent" value={brand} onValueChange={setBrand} />
        <ThemeProvider theme={customTheme} style={{ padding: 16, borderRadius: 12, border: '1px solid var(--ui-color-border)' }}>
          <Card variant="subtle" padding="sm">
            <Stack gap={3}>
              <Text weight="semibold">Preview with {brand.toUpperCase()}</Text>
              <Stack direction="row" gap={2} align="center" wrap>
                <Button size="sm">Primary action</Button>
                <Button size="sm" variant="outline">Secondary</Button>
                <Badge tone="accent">Accent badge</Badge>
              </Stack>
            </Stack>
          </Card>
        </ThemeProvider>
      </Stack>
    );
  },
};
