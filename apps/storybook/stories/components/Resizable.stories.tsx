import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Box, FolderIcon, Heading, Resizable, Stack, Text, TreeView } from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = {
  title: 'Navigation & Layout/Resizable',
  component: Resizable,
  tags: ['new'],
  args: { orientation: 'horizontal' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  parameters: {
    docs: {
      description: {
        component: 'Split-pane layout with pointer dragging and WAI-ARIA window-splitter keyboard controls (Arrow keys, Shift+Arrow, Home, End, and Enter or double-click to reset).',
      },
    },
  },
} satisfies Meta<typeof Resizable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <DemoFrame
      title="Split pane"
      description="Drag the handle, focus it and press Arrow keys (Shift+Arrow for 10% jumps), or double-click / press Enter to reset."
      maxWidth={860}
      code={`<Resizable defaultSizes={[32, 68]}>
  <Resizable.Panel minSize={20} maxSize={60}>Explorer</Resizable.Panel>
  <Resizable.Handle aria-label="Resize explorer" />
  <Resizable.Panel minSize={30}>Editor</Resizable.Panel>
</Resizable>`}
    >
      <div style={{ height: 280, border: '1px solid var(--ui-color-border)', borderRadius: 10, overflow: 'hidden', background: 'var(--ui-color-surface)' }}>
        <Resizable {...args} defaultSizes={[32, 68]}>
          <Resizable.Panel minSize={20} maxSize={60} style={{ background: 'var(--ui-color-surface-subtle)' }}>
            <Box p={4}>
              <Stack gap={2}>
                <Heading level={3} size="md">Explorer</Heading>
                <Text size="sm" tone="secondary">Drag the divider or focus it and press arrow keys.</Text>
              </Stack>
            </Box>
          </Resizable.Panel>
          <Resizable.Handle aria-label="Resize explorer" />
          <Resizable.Panel minSize={30}>
            <Box p={4}>
              <Stack gap={2}>
                <Heading level={3} size="md">Editor</Heading>
                <Text size="sm" tone="secondary">Double-click the divider or press Enter to reset back to 32 / 68.</Text>
              </Stack>
            </Box>
          </Resizable.Panel>
        </Resizable>
      </div>
    </DemoFrame>
  ),
};

const fileTree = [
  {
    id: 'packages',
    label: 'packages/ui',
    icon: <FolderIcon size="sm" />,
    children: [
      { id: 'button', label: 'Button.tsx' },
      { id: 'carousel', label: 'Carousel.tsx' },
      { id: 'resizable', label: 'Resizable.tsx' },
    ],
  },
  {
    id: 'tokens',
    label: 'packages/tokens',
    icon: <FolderIcon size="sm" />,
    children: [
      { id: 'palette', label: 'tokens.ts' },
      { id: 'contrast', label: 'contrast.ts' },
    ],
  },
];

export const NestedLayout: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DemoFrame
      title="IDE workspace layout"
      description="Nested horizontal and vertical Resizable groups with keyboard-accessible split handles."
      badge="Nested split"
      maxWidth={920}
      code={`<Resizable defaultSizes={[28, 72]}>
  <Resizable.Panel minSize={18}>Files</Resizable.Panel>
  <Resizable.Handle aria-label="Resize sidebar" />
  <Resizable.Panel minSize={40}>
    <Resizable orientation="vertical" defaultSizes={[64, 36]}>
      <Resizable.Panel minSize={25}>Editor</Resizable.Panel>
      <Resizable.Handle aria-label="Resize terminal" />
      <Resizable.Panel minSize={20}>Terminal</Resizable.Panel>
    </Resizable>
  </Resizable.Panel>
</Resizable>`}
    >
      <div
        style={{
          height: 380,
          border: '1px solid var(--ui-color-border)',
          borderRadius: 10,
          overflow: 'hidden',
          background: 'var(--ui-color-surface)',
        }}
      >
        <Resizable defaultSizes={[30, 70]}>
          <Resizable.Panel minSize={20} style={{ background: 'var(--ui-color-surface-subtle)', overflow: 'auto' }}>
            <Box p={3}>
              <Stack gap={2}>
                <Text size="xs" weight="semibold" tone="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Explorer
                </Text>
                <TreeView
                  aria-label="Workspace files"
                  items={fileTree}
                  defaultExpanded={['packages', 'tokens']}
                  defaultSelected="resizable"
                />
              </Stack>
            </Box>
          </Resizable.Panel>
          <Resizable.Handle aria-label="Resize sidebar" />
          <Resizable.Panel minSize={40}>
            <Resizable orientation="vertical" defaultSizes={[62, 38]}>
              <Resizable.Panel minSize={28} style={{ overflow: 'auto' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 14px',
                    borderBottom: '1px solid var(--ui-color-border)',
                    background: 'var(--ui-color-surface-subtle)',
                  }}
                >
                  <Text size="xs" weight="semibold" style={{ fontFamily: 'var(--ui-font-mono)' }}>
                    Resizable.tsx
                  </Text>
                  <Badge size="sm" tone="accent">TypeScript</Badge>
                </div>
                <pre
                  style={{
                    margin: 0,
                    padding: '14px 16px',
                    fontFamily: 'var(--ui-font-mono)',
                    fontSize: 12.5,
                    lineHeight: 1.65,
                    color: 'var(--ui-color-text)',
                  }}
                >
                  <code>{`export function Workspace() {
  return (
    <Resizable defaultSizes={[30, 70]}>
      <Resizable.Panel minSize={20}><Sidebar /></Resizable.Panel>
      <Resizable.Handle aria-label="Resize sidebar" />
      <Resizable.Panel minSize={40}><Editor /></Resizable.Panel>
    </Resizable>
  );
}`}</code>
                </pre>
              </Resizable.Panel>
              <Resizable.Handle aria-label="Resize terminal" />
              <Resizable.Panel minSize={22} style={{ background: 'var(--ui-color-surface-subtle)', overflow: 'auto' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 14px',
                    borderBottom: '1px solid var(--ui-color-border)',
                  }}
                >
                  <Text size="xs" weight="semibold" tone="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Output
                  </Text>
                  <Badge size="sm" tone="success">All checks passed</Badge>
                </div>
                <pre
                  style={{
                    margin: 0,
                    padding: '10px 14px',
                    fontFamily: 'var(--ui-font-mono)',
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: 'var(--ui-color-text-secondary)',
                  }}
                >
                  <code>{`✓ pnpm test          114 passed (6 test files)
✓ pnpm size          CSS 13.5 KB / 16 KB · Everything 86.3 KB / 90 KB
✓ pnpm test:visual   16 visual snapshots matched`}</code>
                </pre>
              </Resizable.Panel>
            </Resizable>
          </Resizable.Panel>
        </Resizable>
      </div>
    </DemoFrame>
  ),
};
