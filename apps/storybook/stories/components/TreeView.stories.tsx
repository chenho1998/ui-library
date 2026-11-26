import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Card, FileIcon, FolderIcon, Grid, Stack, Text, TreeView, type TreeNode } from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = { title: 'Data Display/TreeView', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const files: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    icon: <FolderIcon size="sm" />,
    children: [
      {
        id: 'components',
        label: 'components',
        icon: <FolderIcon size="sm" />,
        children: [
          { id: 'button', label: 'Button.tsx', icon: <FileIcon size="sm" /> },
          { id: 'sidebar', label: 'Sidebar.tsx', icon: <FileIcon size="sm" /> },
          { id: 'datatable', label: 'DataTable.tsx', icon: <FileIcon size="sm" /> },
        ],
      },
      { id: 'index', label: 'index.ts', icon: <FileIcon size="sm" /> },
    ],
  },
  { id: 'readme', label: 'README.md', icon: <FileIcon size="sm" /> },
  { id: 'pkg', label: 'package.json', icon: <FileIcon size="sm" /> },
];

const fileDetails: Record<string, { path: string; size: string; note: string }> = {
  src: { path: 'packages/ui/src', size: 'Directory', note: 'Core React components, hooks and CSS layers.' },
  components: { path: 'packages/ui/src/components', size: 'Directory', note: '50 accessible primitives built on @yourorg/tokens.' },
  button: { path: 'packages/ui/src/actions/index.tsx', size: '2.5 KB gzip', note: 'Button, IconButton, ButtonGroup and Link.' },
  sidebar: { path: 'packages/ui/src/navigation/Sidebar.tsx', size: '3.1 KB gzip', note: 'Collapsible left rail with submenus and mobile Drawer support.' },
  datatable: { path: 'packages/ui/src/data/DataTable.tsx', size: '3.8 KB gzip', note: 'Search, sorting, multi-select bulk actions and pagination.' },
  index: { path: 'packages/ui/src/index.ts', size: 'Entry', note: 'Tree-shakeable named exports for components, themes and icons.' },
  readme: { path: 'README.md', size: '8.4 KB', note: 'Quick start, theming guide and live preview inventory.' },
  pkg: { path: 'packages/ui/package.json', size: '1.8 KB', note: 'ESM entry, CSS exports and peer dependencies.' },
};

export const TreeViewExample: Story = {
  name: 'TreeView',
  render: function Render() {
    const [selected, setSelected] = React.useState('index');
    const info = fileDetails[selected] ?? fileDetails.index!;
    return (
      <DemoFrame
        title="Interactive file explorer"
        description="Full WAI-ARIA TreeView: use Arrow keys, * to expand all siblings, or type letters to jump."
        badge="Type-ahead · *"
        code={`<TreeView aria-label="Files" items={files} defaultExpanded={['src']} selected={selected} onSelect={setSelected} />`}
      >
        <Grid minChildWidth="260px" gap={5} style={{ alignItems: 'start' }}>
          <div style={{ border: '1px solid var(--ui-color-border)', borderRadius: 10, padding: 10, background: 'var(--ui-color-surface-subtle)' }}>
            <TreeView
              aria-label="Files"
              items={files}
              defaultExpanded={['src', 'components']}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
          <Card variant="outline">
            <Stack gap={2}>
              <Stack direction="row" justify="between" align="center">
                <Text weight="semibold" style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 13 }}>{info.path}</Text>
                <Badge size="sm" tone="accent">{info.size}</Badge>
              </Stack>
              <Text size="sm" tone="secondary">{info.note}</Text>
            </Stack>
          </Card>
        </Grid>
      </DemoFrame>
    );
  },
};
