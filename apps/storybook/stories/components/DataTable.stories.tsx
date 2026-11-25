import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, Badge, Button, DataTable, EmptyState, Stack, toast, type DataTableColumn } from '@yourorg/ui';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Invited' | 'Suspended';
  projects: number;
}

const members: Member[] = [
  { id: '1', name: 'Aisha Rahman', email: 'aisha@acme.test', role: 'Admin', status: 'Active', projects: 12 },
  { id: '2', name: 'Wei Ling Tan', email: 'weiling@acme.test', role: 'Editor', status: 'Active', projects: 8 },
  { id: '3', name: 'Ravi Kumar', email: 'ravi@acme.test', role: 'Editor', status: 'Invited', projects: 3 },
  { id: '4', name: 'Farah Nadia', email: 'farah@acme.test', role: 'Viewer', status: 'Active', projects: 5 },
  { id: '5', name: 'Daniel Lim', email: 'daniel@acme.test', role: 'Admin', status: 'Active', projects: 19 },
  { id: '6', name: 'Siti Nurhaliza', email: 'siti@acme.test', role: 'Viewer', status: 'Suspended', projects: 1 },
  { id: '7', name: 'Marcus Wong', email: 'marcus@acme.test', role: 'Editor', status: 'Active', projects: 14 },
  { id: '8', name: 'Priya Nair', email: 'priya@acme.test', role: 'Viewer', status: 'Active', projects: 6 },
];

const statusTone = { Active: 'success', Invited: 'info', Suspended: 'danger' } as const;

const columns: DataTableColumn<Member>[] = [
  {
    key: 'name',
    header: 'Member',
    sortable: true,
    cell: (r) => (
      <Stack direction="row" gap={2} align="center">
        <Avatar name={r.name} size="xs" />
        <span>{r.name}</span>
      </Stack>
    ),
  },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    cell: (r) => <Badge tone={statusTone[r.status]}>{r.status}</Badge>,
  },
  { key: 'projects', header: 'Projects', sortable: true, align: 'end' },
];

const meta = {
  title: 'Components/Data display/DataTable',
  component: DataTable,
  tags: ['new'],
  args: {
    caption: 'Workspace members',
    searchable: true,
    selectable: true,
    pageSize: 5,
    density: 'default',
    loading: false,
    stickyHeader: false,
  },
  argTypes: {
    density: { control: 'inline-radio', options: ['default', 'compact'] },
    pageSize: { control: { type: 'number', min: 2, max: 10 } },
    searchable: { control: 'boolean' },
    selectable: { control: 'boolean' },
    loading: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Client-side (or server-backed) sorting, filtering, selection, bulk actions and pagination built on `Table` and `Pagination`.',
      },
    },
  },
} satisfies Meta<typeof DataTable<Member>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <DataTable<Member>
      {...args}
      columns={columns}
      data={members}
      rowKey={(r) => r.id}
      rowLabel={(r) => r.name}
      defaultSort={{ key: 'projects', direction: 'desc' }}
      toolbar={<Button size="sm" onClick={() => toast.info('Invite modal opened')}>Invite member</Button>}
      bulkActions={(selected, clear) => (
        <>
          <Button
            size="sm"
            variant="outline"
            tone="neutral"
            onClick={() => {
              toast.success(`Exported ${selected.size} member(s)`);
              clear();
            }}
          >
            Export CSV
          </Button>
          <Button size="sm" variant="ghost" tone="neutral" onClick={clear}>Clear</Button>
        </>
      )}
      emptyState={<EmptyState title="No matching members" description="Try another search query." />}
    />
  ),
};
