import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Icons from '@yourorg/icons';
import { Card, Grid, SegmentedControl, Stack, Text, TextField, toast } from '@yourorg/ui';

const meta = {
  title: 'Foundations/Icons',
  tags: ['new'],
  parameters: {
    docs: {
      description: {
        component: '40 tree-shakeable SVG icons from `@yourorg/icons` (also re-exported from `@yourorg/ui`), plus `createIcon` for custom icons.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const iconEntries = Object.entries(Icons).filter(([name]) => name !== 'createIcon' && name.endsWith('Icon')) as Array<[string, React.ComponentType<Icons.IconProps>]>;

const SparkIcon = Icons.createIcon('SparkIcon', <path d="M12 2 14.5 9.5 22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" />);

export const Gallery: Story = {
  render: function Render() {
    const [query, setQuery] = React.useState('');
    const [size, setSize] = React.useState<'sm' | 'md' | 'lg'>('md');
    const filtered = iconEntries.filter(([name]) => name.toLowerCase().includes(query.trim().toLowerCase()));
    return (
      <Stack gap={4}>
        <Stack direction="row" gap={3} align="end" wrap>
          <div style={{ flex: '1 1 240px', maxWidth: 340 }}>
            <TextField
              label="Filter icons"
              placeholder={`Search ${iconEntries.length} icons…`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              startAdornment={<Icons.SearchIcon size="sm" />}
            />
          </div>
          <SegmentedControl
            aria-label="Icon size"
            value={size}
            onValueChange={(v) => setSize(v as 'sm' | 'md' | 'lg')}
            items={[
              { value: 'sm', label: 'sm (16)' },
              { value: 'md', label: 'md (20)' },
              { value: 'lg', label: 'lg (24)' },
            ]}
          />
        </Stack>
        <Text size="sm" tone="secondary">
          Showing {filtered.length} of {iconEntries.length} icons. Click any card to copy its import.
        </Text>
        <Grid minChildWidth="136px" gap={3}>
          {filtered.map(([name, Comp]) => (
            <Card
              key={name}
              variant="outline"
              padding="sm"
              interactive
              role="button"
              tabIndex={0}
              onClick={() => {
                void navigator.clipboard?.writeText(`import { ${name} } from '@yourorg/icons';`);
                toast.success(`Copied ${name}`);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  void navigator.clipboard?.writeText(`import { ${name} } from '@yourorg/icons';`);
                  toast.success(`Copied ${name}`);
                }
              }}
              style={{ alignItems: 'center', textAlign: 'center', gap: 8 }}
            >
              <Comp size={size} />
              <Text size="xs" style={{ fontFamily: 'var(--ui-font-mono)' }}>{name}</Text>
            </Card>
          ))}
        </Grid>
        <Card variant="subtle" padding="sm">
          <Stack direction="row" gap={3} align="center">
            <SparkIcon size="lg" />
            <Text size="sm">
              Need a custom icon? Use <code>createIcon(&apos;SparkIcon&apos;, &lt;path … /&gt;)</code> from <code>@yourorg/icons</code>.
            </Text>
          </Stack>
        </Card>
      </Stack>
    );
  },
};
