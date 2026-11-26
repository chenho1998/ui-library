import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Alert, Badge, Button, Card, Heading, Progress, Stack, Switch, Text, TextField, ThemeProvider, animeTheme, brutalistTheme,
  createTheme, neonTheme, pixelTheme, sketchTheme, type ColorScheme, type Theme,
} from '@yourorg/ui';

const meta = {
  title: 'Getting Started/Themes',
  tags: ['!autodocs', 'dev'],
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    a11y: { test: 'off' },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const themes: Array<{ name: string; tag: string; theme?: Theme; code: string }> = [
  { name: 'Default', tag: 'System', code: '<ThemeProvider>' },
  {
    name: 'Violet',
    tag: 'Custom brand',
    theme: createTheme({ brand: '#7c3aed', tokens: { radius: { md: '6px', lg: '10px' } } }),
    code: "createTheme({ brand: '#7c3aed' })",
  },
  {
    name: 'Teal',
    tag: 'Pill radius',
    theme: createTheme({ brand: '#0d9488', tokens: { radius: { md: '999px' } } }),
    code: "createTheme({ brand: '#0d9488' })",
  },
  { name: 'Anime', tag: 'Expressive', theme: animeTheme, code: 'theme={animeTheme}' },
  { name: 'Pixel', tag: 'Expressive', theme: pixelTheme, code: 'theme={pixelTheme}' },
  { name: 'Brutalist', tag: 'Expressive', theme: brutalistTheme, code: 'theme={brutalistTheme}' },
  { name: 'Sketch', tag: 'Expressive', theme: sketchTheme, code: 'theme={sketchTheme}' },
  { name: 'Neon', tag: 'Expressive', theme: neonTheme, code: 'theme={neonTheme}' },
];

function Sample({ name, tag, code }: { name: string; tag: string; code: string }) {
  return (
    <Card variant="outline" style={{ height: '100%' }}>
      <Stack gap={3}>
        <Stack direction="row" justify="between" align="center" gap={2}>
          <Heading level={3} size="lg">{name}</Heading>
          <Badge tone="accent" size="sm">{tag}</Badge>
        </Stack>
        <code
          style={{
            display: 'block',
            padding: '5px 8px',
            borderRadius: 6,
            background: 'var(--ui-color-surface-subtle)',
            border: '1px solid var(--ui-color-border)',
            fontFamily: 'var(--ui-font-mono)',
            fontSize: 11,
            color: 'var(--ui-color-text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {code}
        </code>
        <TextField label="Project name" defaultValue="Website redesign" />
        <Switch label="Notify the team" defaultChecked />
        <Progress label="Upload" value={64} showValue />
        <Alert tone="success" title="Saved">All changes are live.</Alert>
        <Stack direction="row" gap={2}>
          <Button size="sm">Publish</Button>
          <Button size="sm" variant="outline" tone="neutral">Preview</Button>
        </Stack>
      </Stack>
    </Card>
  );
}

/** Every theme restyles every component; the app changes only the `theme` prop. Use the Scheme toolbar for dark mode. */
export const Gallery: Story = {
  name: 'Themes',
  render: (_args, { globals }) => {
    const scheme = (globals.scheme as ColorScheme) ?? 'light';
    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '20px 28px',
            borderBottom: '1px solid var(--ui-color-border)',
            background: 'var(--ui-color-surface-subtle)',
          }}
        >
          <Stack gap={1}>
            <Heading level={1} size="xl">Themes gallery</Heading>
            <Text size="sm" tone="secondary">
              Every theme restyles all 50 components from a single <code>ThemeProvider</code> prop. Switch the Scheme toolbar to compare light and dark modes.
            </Text>
          </Stack>
          <Stack direction="row" gap={2}>
            <Badge tone="accent">8 themes</Badge>
            <Badge tone="neutral" variant="outline">{scheme} mode</Badge>
          </Stack>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(max(265px, 25%), 1fr))',
          }}
        >
          {themes.map(({ name, tag, theme, code }) => (
            <ThemeProvider
              key={name}
              theme={theme}
              colorScheme={scheme}
              style={{
                padding: 20,
                borderInlineEnd: '1px solid var(--ui-color-border)',
                borderBlockEnd: '1px solid var(--ui-color-border)',
              }}
            >
              <Sample name={name} tag={tag} code={code} />
            </ThemeProvider>
          ))}
        </div>
      </div>
    );
  },
};
