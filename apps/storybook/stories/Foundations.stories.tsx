import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { tokens, STEPS } from '@yourorg/tokens';
import {
  Badge, Card, Grid, Heading, SearchIcon, SegmentedControl, Stack, Text, TextField, toast,
} from '@yourorg/ui';

const meta = {
  title: 'Foundations/Design tokens',
  parameters: {
    controls: { disable: true },
    a11y: { test: 'off' },
    docs: {
      description: {
        component:
          'Interactive token explorer for OKLCH palettes, WCAG AA semantic colours, typography scale, spacing, radius and shadows. Click any token to copy its CSS variable.',
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

type TabKey = 'semantic' | 'palettes' | 'typography' | 'spacing' | 'shape';

const copyVar = (varName: string) => {
  void navigator.clipboard?.writeText(`var(${varName})`);
  toast.success(`Copied var(${varName})`);
};

function SemanticCard({ name, varName }: { name: string; varName: string }) {
  return (
    <Card
      variant="outline"
      padding="sm"
      interactive
      role="button"
      tabIndex={0}
      onClick={() => copyVar(varName)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          copyVar(varName);
        }
      }}
      style={{ gap: 8 }}
    >
      <div
        style={{
          height: 52,
          borderRadius: 8,
          background: `var(${varName})`,
          border: '1px solid var(--ui-color-border)',
        }}
      />
      <Stack gap={0}>
        <Text size="sm" weight="semibold">{name}</Text>
        <Text
          size="xs"
          tone="secondary"
          style={{
            fontFamily: 'var(--ui-font-mono)',
            fontSize: 11.5,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={varName}
        >
          {varName}
        </Text>
      </Stack>
    </Card>
  );
}

export const Explorer: Story = {
  name: 'Token explorer',
  render: function Render() {
    const [tab, setTab] = React.useState<TabKey>('semantic');
    const [query, setQuery] = React.useState('');
    const q = query.trim().toLowerCase();

    const semanticKeys = Object.keys(tokens.color.light).filter(
      (k) => !q || k.toLowerCase().includes(q) || `--ui-color-${k}`.includes(q),
    );
    const paletteNames = Object.keys(tokens.palette).filter((p) => !q || p.toLowerCase().includes(q));
    const fontEntries = Object.entries(tokens.font.size)
      .reverse()
      .filter(([k]) => !q || k.toLowerCase().includes(q) || `text-${k}`.includes(q));
    const spaceEntries = Object.entries(tokens.space)
      .filter(([k]) => k !== '0')
      .filter(([k, v]) => !q || k.includes(q) || String(v).includes(q));

    return (
      <Stack gap={5}>
        <Stack direction="row" gap={3} align="end" justify="between" wrap>
          <SegmentedControl
            aria-label="Token category"
            value={tab}
            onValueChange={(v) => setTab(v as TabKey)}
            items={[
              { value: 'semantic', label: 'Semantic colours' },
              { value: 'palettes', label: 'OKLCH palettes' },
              { value: 'typography', label: 'Typography' },
              { value: 'spacing', label: 'Spacing' },
              { value: 'shape', label: 'Radius & shadows' },
            ]}
          />
          <div style={{ width: 260 }}>
            <TextField
              label="Filter tokens"
              hideLabel
              placeholder="Filter tokens…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              startAdornment={<SearchIcon size="sm" />}
              size="sm"
            />
          </div>
        </Stack>

        <Stack direction="row" gap={2} align="center" wrap>
          <Badge tone="success" size="sm">30 contrast pairs verified</Badge>
          <Badge tone="neutral" variant="outline" size="sm">Click any token to copy var(--ui-*)</Badge>
          <Text size="xs" tone="secondary">
            Switch the Scheme or Theme toolbar above to inspect live remapped values.
          </Text>
        </Stack>

        {tab === 'semantic' ? (
          <Grid minChildWidth="196px" gap={3}>
            {semanticKeys.map((k) => (
              <SemanticCard key={k} name={k} varName={`--ui-color-${k}`} />
            ))}
          </Grid>
        ) : null}

        {tab === 'palettes' ? (
          <Stack gap={5}>
            {paletteNames.map((p) => (
              <Stack key={p} gap={2}>
                <Heading level={3} size="md" style={{ textTransform: 'capitalize' }}>{p}</Heading>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, minmax(0, 1fr))', gap: 6 }}>
                  {STEPS.map((s) => {
                    const varName = `--ui-${p}-${s}`;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => copyVar(varName)}
                        title={`Copy var(${varName})`}
                        style={{
                          display: 'grid',
                          gap: 4,
                          padding: 0,
                          border: 0,
                          background: 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <span
                          style={{
                            display: 'block',
                            height: 44,
                            borderRadius: 7,
                            background: `var(${varName})`,
                            border: '1px solid var(--ui-color-border)',
                          }}
                        />
                        <Text size="xs" weight="medium">{s}</Text>
                      </button>
                    );
                  })}
                </div>
              </Stack>
            ))}
          </Stack>
        ) : null}

        {tab === 'typography' ? (
          <Card variant="outline">
            <Stack gap={4}>
              {fontEntries.map(([k, [size, lh]]) => (
                <div
                  key={k}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '160px 1fr',
                    gap: 16,
                    alignItems: 'baseline',
                    paddingBottom: 12,
                    borderBottom: '1px solid var(--ui-color-border)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => copyVar(`--ui-text-${k}`)}
                    style={{
                      border: 0,
                      background: 'transparent',
                      padding: 0,
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: 'var(--ui-font-mono)',
                      fontSize: 12,
                      color: 'var(--ui-color-text-secondary)',
                    }}
                  >
                    --ui-text-{k} · {size}/{lh}
                  </button>
                  <Text size={k as never}>Build interfaces people trust</Text>
                </div>
              ))}
            </Stack>
          </Card>
        ) : null}

        {tab === 'spacing' ? (
          <Card variant="outline">
            <Stack gap={3}>
              {spaceEntries.map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr',
                    gap: 16,
                    alignItems: 'center',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => copyVar(`--ui-space-${k}`)}
                    style={{
                      border: 0,
                      background: 'transparent',
                      padding: 0,
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: 'var(--ui-font-mono)',
                      fontSize: 12,
                      color: 'var(--ui-color-text-secondary)',
                    }}
                  >
                    --ui-space-{k} · {v}
                  </button>
                  <div style={{ width: v, height: 14, background: 'var(--ui-color-accent)', borderRadius: 4 }} />
                </div>
              ))}
            </Stack>
          </Card>
        ) : null}

        {tab === 'shape' ? (
          <Stack gap={6}>
            <Stack gap={3}>
              <Heading level={3} size="md">Corner radius</Heading>
              <Stack direction="row" gap={4} wrap>
                {Object.keys(tokens.radius).map((k) => (
                  <Card
                    key={k}
                    variant="outline"
                    padding="sm"
                    interactive
                    role="button"
                    tabIndex={0}
                    onClick={() => copyVar(`--ui-radius-${k}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        copyVar(`--ui-radius-${k}`);
                      }
                    }}
                    style={{ alignItems: 'center', minWidth: 108, gap: 8 }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        background: 'var(--ui-color-accent-subtle)',
                        border: '2px solid var(--ui-color-accent)',
                        borderRadius: `var(--ui-radius-${k})`,
                      }}
                    />
                    <Text size="xs" style={{ fontFamily: 'var(--ui-font-mono)' }}>radius-{k}</Text>
                  </Card>
                ))}
              </Stack>
            </Stack>

            <Stack gap={3}>
              <Heading level={3} size="md">Elevation shadows</Heading>
              <Stack direction="row" gap={4} wrap>
                {Object.keys(tokens.shadow).map((k) => (
                  <Card
                    key={k}
                    variant="outline"
                    padding="sm"
                    interactive
                    role="button"
                    tabIndex={0}
                    onClick={() => copyVar(`--ui-shadow-${k}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        copyVar(`--ui-shadow-${k}`);
                      }
                    }}
                    style={{ alignItems: 'center', minWidth: 120, gap: 8 }}
                  >
                    <div
                      style={{
                        width: 84,
                        height: 52,
                        background: 'var(--ui-color-surface)',
                        borderRadius: 8,
                        boxShadow: `var(--ui-shadow-${k})`,
                        border: '1px solid var(--ui-color-border)',
                      }}
                    />
                    <Text size="xs" style={{ fontFamily: 'var(--ui-font-mono)' }}>shadow-{k}</Text>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Stack>
        ) : null}
      </Stack>
    );
  },
};
