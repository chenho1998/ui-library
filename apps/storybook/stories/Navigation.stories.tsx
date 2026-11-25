import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs, Pagination, Stack, Tabs, Text } from '@yourorg/ui';

const meta = {
  title: 'Navigation & Layout/Tabs & Pagination',
  parameters: { controls: { disable: true } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const TabsExample: Story = {
  name: 'Tabs',
  render: () => (
    <Stack gap={8}>
      {(['line', 'pill'] as const).map((variant) => (
        <Tabs key={variant} defaultValue="general" variant={variant}>
          <Tabs.List aria-label={`Settings (${variant})`}>
            <Tabs.Trigger value="general">General</Tabs.Trigger>
            <Tabs.Trigger value="members">Members</Tabs.Trigger>
            <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
            <Tabs.Trigger value="audit" disabled>Audit log</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="general"><Text tone="secondary">Workspace name, logo and language.</Text></Tabs.Content>
          <Tabs.Content value="members"><Text tone="secondary">Invite and manage people.</Text></Tabs.Content>
          <Tabs.Content value="billing"><Text tone="secondary">Plan, invoices and payment method.</Text></Tabs.Content>
        </Tabs>
      ))}
    </Stack>
  ),
};

export const BreadcrumbsExample: Story = {
  name: 'Breadcrumbs',
  render: () => <Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: 'Projects', href: '#' }, { label: 'Website redesign' }]} />,
};

export const PaginationExample: Story = {
  name: 'Pagination',
  render: function Render() {
    const [page, setPage] = React.useState(7);
    return (
      <Stack gap={4}>
        <Pagination page={page} pageCount={20} onPageChange={setPage} />
        <Pagination page={2} pageCount={5} onPageChange={() => {}} />
      </Stack>
    );
  },
};
