import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileIcon, FolderIcon, TreeView, type TreeNode } from '@yourorg/ui';

const meta = { title: 'Components/Data display/TreeView', tags: ['new'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const files: TreeNode[] = [
  { id: 'src', label: 'src', icon: <FolderIcon size="sm" />, children: [
    { id: 'components', label: 'components', icon: <FolderIcon size="sm" />, children: [
      { id: 'button', label: 'Button.tsx', icon: <FileIcon size="sm" /> },
      { id: 'sidebar', label: 'Sidebar.tsx', icon: <FileIcon size="sm" /> },
    ] },
    { id: 'index', label: 'index.ts', icon: <FileIcon size="sm" /> },
  ] },
  { id: 'readme', label: 'README.md', icon: <FileIcon size="sm" /> },
  { id: 'pkg', label: 'package.json', icon: <FileIcon size="sm" /> },
];

export const TreeViewExample: Story = {
  name: 'TreeView',
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <TreeView aria-label="Files" items={files} defaultExpanded={['src']} defaultSelected="index" />
    </div>
  ),
};
