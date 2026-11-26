import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Avatar, Button, ChartIcon, Drawer, FolderIcon, Heading, HomeIcon, InboxIcon, MenuIcon, SettingsIcon, Sidebar, Text, UsersIcon,
  useSidebar,
} from '@yourorg/ui';

const meta = {
  title: 'Navigation & Layout/Sidebar',
  component: Sidebar,
  excludeStories: ['AppNav'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'App navigation down the left edge. Collapse it to icons with `Sidebar.Toggle`; on phones, put the same Sidebar in a `Drawer`.' } },
  },
} satisfies Meta<typeof Sidebar>;
export default meta;
type Story = StoryObj<typeof meta>;

function Brand() {
  const { collapsed } = useSidebar();
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
      <span aria-hidden="true" style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 8, background: 'var(--ui-color-accent)', color: 'var(--ui-color-text-on-accent)' }}>A</span>
      {collapsed ? null : 'Acme'}
    </span>
  );
}

function Account() {
  const { collapsed } = useSidebar();
  return (
    <>
      <Avatar name="Aisha Rahman" size="sm" />
      {collapsed ? null : (
        <span style={{ display: 'grid', lineHeight: 1.3 }}>
          <Text size="sm" weight="medium">Aisha Rahman</Text>
          <Text size="xs" tone="secondary">aisha@acme.test</Text>
        </span>
      )}
    </>
  );
}

export function AppNav(props: React.ComponentProps<typeof Sidebar>) {
  const [page, setPage] = React.useState('home');
  const item = (id: string, label: string, icon?: React.ReactNode, badge?: number) => (
    <Sidebar.Item icon={icon} badge={badge} current={page === id} onClick={() => setPage(id)}>
      {label}
    </Sidebar.Item>
  );
  return (
    <Sidebar {...props}>
      <Sidebar.Header>
        <Brand />
        <Sidebar.Toggle />
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Group label="Workspace">
          {item('home', 'Home', <HomeIcon size={18} />)}
          {item('inbox', 'Inbox', <InboxIcon size={18} />, 3)}
          {item('reports', 'Reports', <ChartIcon size={18} />)}
          <Sidebar.Submenu icon={<FolderIcon size={18} />} label="Projects" defaultOpen>
            {item('website', 'Website redesign')}
            {item('mobile', 'Mobile app')}
            {item('brand', 'Brand refresh')}
          </Sidebar.Submenu>
        </Sidebar.Group>
        <Sidebar.Group label="Account">
          {item('team', 'Team', <UsersIcon size={18} />)}
          {item('settings', 'Settings', <SettingsIcon size={18} />)}
        </Sidebar.Group>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Account />
      </Sidebar.Footer>
    </Sidebar>
  );
}

export const AppShell: Story = {
  render: () => (
    <div style={{ display: 'flex', height: '100vh' }}>
      <AppNav />
      <main style={{ flex: 1, padding: 32 }}>
        <Heading level={1} size="2xl">Home</Heading>
        <Text tone="secondary">Pick an item in the sidebar, or collapse it with the panel button.</Text>
      </main>
    </div>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <div style={{ display: 'flex', height: '100vh' }}>
      <AppNav defaultCollapsed />
    </div>
  ),
};

export const MobileDrawer: Story = {
  name: 'On phones (in a Drawer)',
  render: () => (
    <div style={{ padding: 16 }}>
      <Drawer>
        <Drawer.Trigger asChild>
          <Button variant="outline" tone="neutral" startIcon={<MenuIcon size="sm" />}>Menu</Button>
        </Drawer.Trigger>
        <Drawer.Content side="left" size="sm" showClose={false} aria-describedby={undefined}>
          <Drawer.Title className="ui-visually-hidden">Navigation</Drawer.Title>
          <div style={{ height: '100%', margin: -24 }}>
            <AppNav style={{ width: '100%', borderInlineEnd: 0 }} />
          </div>
        </Drawer.Content>
      </Drawer>
    </div>
  ),
};
