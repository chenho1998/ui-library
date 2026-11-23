import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Alert, Badge, Button, Card, Heading, Progress, Stack, Switch, Text, TextField, ThemeProvider, animeTheme, brutalistTheme,
  createTheme, neonTheme, pixelTheme, sketchTheme, type ColorScheme, type Theme,
} from '@yourorg/ui';

const meta = {
  title: 'Get started/Themes',
  parameters: { layout: 'fullscreen', a11y: { test: 'off' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const themes: Array<{ name: string; theme?: Theme; code: string }> = [
  { name: 'Default', code: '<ThemeProvider>' },
  { name: 'Violet', theme: createTheme({ brand: '#7c3aed', tokens: { radius: { md: '6px', lg: '10px' } } }), code: "createTheme({ brand: '#7c3aed' })" },
  { name: 'Anime', theme: animeTheme, code: 'theme={animeTheme}' },
  { name: 'Pixel', theme: pixelTheme, code: 'theme={pixelTheme}' },
  { name: 'Brutalist', theme: brutalistTheme, code: 'theme={brutalistTheme}' },
  { name: 'Sketch', theme: sketchTheme, code: 'theme={sketchTheme}' },
  { name: 'Neon', theme: neonTheme, code: 'theme={neonTheme}' },
];

function Sample({ name, code }: { name: string; code: string }) {
  return (
    <Card variant="outline">
      <Stack gap={3}>
        <Stack direction="row" justify="between" align="center">
          <Heading level={3} size="lg">{name}</Heading>
          <Badge tone="accent">Theme</Badge>
        </Stack>
        <Text size="sm" tone="secondary"><code>{code}</code></Text>
        <TextField label="Project name" defaultValue="Website redesign" />
        <Switch label="Notify the team" defaultChecked />
        <Progress label="Upload" value={64} showValue />
        <Alert tone="success" title="Saved">All changes are live.</Alert>
        <Stack direction="row" gap={2}>
          <Button>Publish</Button>
          <Button variant="outline" tone="neutral">Preview</Button>
          <Button variant="ghost" tone="neutral">Cancel</Button>
        </Stack>
      </Stack>
    </Card>
  );
}

/** Every theme restyles every component; the app changes only the `theme` prop. Use the Scheme toolbar for dark mode. */
export const Gallery: Story = {
  render: (_args, { globals }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
      {themes.map(({ name, theme, code }) => (
        <ThemeProvider key={name} theme={theme} colorScheme={(globals.scheme as ColorScheme) ?? 'light'} style={{ padding: 24 }}>
          <Sample name={name} code={code} />
        </ThemeProvider>
      ))}
    </div>
  ),
};
