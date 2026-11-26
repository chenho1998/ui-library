import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs, Pagination, Stack, Tabs, Text } from '@yourorg/ui';
import { DemoFrame } from './PreviewKit';

const meta = {
  title: 'Navigation & Layout/Tabs & Pagination',
  parameters: { controls: { disable: true } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const TabsExample: Story = {
  name: 'Tabs',
  render: () => (
    <DemoFrame
      title="Line & pill tabs"
      description="Switch views with arrow keys, Home, and End. Supports disabled tabs."
      badge="2 variants"
      code={`<Tabs defaultValue="general" variant="line">
  <Tabs.List aria-label="Settings">
    <Tabs.Trigger value="general">General</Tabs.Trigger>
    <Tabs.Trigger value="members">Members</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="general">...</Tabs.Content>
</Tabs>`}
    >
      <Stack gap={6}>
        {(['line', 'pill'] as const).map((variant) => (
          <Tabs key={variant} defaultValue="general" variant={variant}>
            <Tabs.List aria-label={`Settings (${variant})`}>
              <Tabs.Trigger value="general">General</Tabs.Trigger>
              <Tabs.Trigger value="members">Members</Tabs.Trigger>
              <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
              <Tabs.Trigger value="audit" disabled>Audit log</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="general"><Text tone="secondary">Workspace name, logo and language preferences.</Text></Tabs.Content>
            <Tabs.Content value="members"><Text tone="secondary">Invite teammates and manage access roles.</Text></Tabs.Content>
            <Tabs.Content value="billing"><Text tone="secondary">Plan tier, invoices and payment method.</Text></Tabs.Content>
          </Tabs>
        ))}
      </Stack>
    </DemoFrame>
  ),
};

export const BreadcrumbsExample: Story = {
  name: 'Breadcrumbs',
  render: () => (
    <DemoFrame
      title="Breadcrumbs"
      description="Semantic navigation trail marking the current page with aria-current='page'."
      code={`<Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: 'Projects', href: '#' }, { label: 'Website redesign' }]} />`}
    >
      <Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: 'Projects', href: '#' }, { label: 'Website redesign' }]} />
    </DemoFrame>
  ),
};

export const PaginationExample: Story = {
  name: 'Pagination',
  render: function Render() {
    const [page, setPage] = React.useState(7);
    return (
      <DemoFrame
        title="Pagination"
        description="Controlled or uncontrolled pagination with automatic ellipsis truncation."
        code={`<Pagination page={page} pageCount={20} onPageChange={setPage} />
<Pagination defaultPage={2} pageCount={5} />`}
      >
        <Stack gap={4}>
          <Pagination page={page} pageCount={20} onPageChange={setPage} />
          <Pagination defaultPage={2} pageCount={5} />
        </Stack>
      </DemoFrame>
    );
  },
};
