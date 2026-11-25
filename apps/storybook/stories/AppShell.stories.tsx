import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Badge, Banner, Button, Card, ChartIcon, CheckIcon, CommandPalette, Grid, Heading, HomeIcon, Kbd, PlusIcon,
  SearchIcon, SettingsIcon, Stack, Stat, Stepper, Text, Timeline, UsersIcon, toast,
} from '@yourorg/ui';
import { AppNav } from './components/Sidebar.stories';

const meta = {
  title: 'Templates/App Shell',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  tags: ['!autodocs', 'dev'],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

/** Sidebar, banner, command palette, stats, a stepper and a timeline working together. Try it with every theme. */
export const Dashboard: Story = {
  name: 'App Shell',
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    const [showBanner, setShowBanner] = React.useState(true);
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'stretch' }}>
        <AppNav style={{ height: 'auto', minHeight: '100vh' }} />
        <main style={{ flex: 1, minWidth: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {showBanner ? (
            <Banner
              tone="accent"
              title="v0.3 is live"
              action={
                <Button size="sm" variant="outline" tone="neutral" onClick={() => setOpen(true)}>
                  Open command palette
                </Button>
              }
              onDismiss={() => setShowBanner(false)}
            >
              DataTable, Carousel, ColorPicker, Resizable and Banner are ready across every theme.
            </Banner>
          ) : null}
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 28px',
              borderBottom: '1px solid var(--ui-color-border)',
              background: 'var(--ui-color-surface)',
            }}
          >
            <Stack direction="row" gap={2} align="center">
              <Heading level={1} size="xl">Overview</Heading>
              <Badge tone="success" size="sm">Production</Badge>
            </Stack>
            <Button
              variant="outline"
              tone="neutral"
              size="sm"
              startIcon={<SearchIcon size="sm" />}
              style={{ marginInlineStart: 'auto' }}
              onClick={() => setOpen(true)}
            >
              Search <Kbd>⌘</Kbd><Kbd>K</Kbd>
            </Button>
            <Button
              size="sm"
              startIcon={<PlusIcon size="sm" />}
              onClick={() => toast.success('Project draft created')}
            >
              New project
            </Button>
          </header>
          <Stack gap={6} style={{ padding: 28 }}>
            <Grid minChildWidth="200px" gap={4}>
              <Card variant="outline">
                <Stat label="Monthly revenue" value="RM 14,504" change={12.4} changeLabel="vs October" icon={<ChartIcon size="sm" />} />
              </Card>
              <Card variant="outline">
                <Stat label="Active seats" value="2,318" change={4.2} changeLabel="vs October" icon={<UsersIcon size="sm" />} />
              </Card>
              <Card variant="outline">
                <Stat label="Monthly churn" value="1.9%" change={-0.4} invertTrend changeLabel="vs October" icon={<SettingsIcon size="sm" />} />
              </Card>
              <Card variant="outline">
                <Stat label="Uptime SLA" value="99.98%" change={0.1} changeLabel="30-day avg" icon={<CheckIcon size="sm" />} />
              </Card>
            </Grid>
            <Grid minChildWidth="320px" gap={4}>
              <Card variant="outline">
                <Card.Header>
                  <Card.Title level={2}>Workspace onboarding</Card.Title>
                  <Card.Description>3 of 4 launch milestones complete.</Card.Description>
                </Card.Header>
                <Stepper
                  aria-label="Onboarding progress"
                  orientation="vertical"
                  current={2}
                  steps={[
                    { title: 'Create workspace', description: 'Tokens and brand accent configured' },
                    { title: 'Invite team', description: '8 members active' },
                    { title: 'Connect billing', description: 'Verify invoice recipient' },
                    { title: 'Launch to production' },
                  ]}
                />
              </Card>
              <Card variant="outline">
                <Card.Header>
                  <Card.Title level={2}>Recent activity</Card.Title>
                  <Card.Description>Live workspace events and releases.</Card.Description>
                </Card.Header>
                <Timeline>
                  <Timeline.Item
                    title="Invoice INV-2041 paid"
                    description="RM 2,058 settled via FPX"
                    time="10:24"
                    tone="success"
                    icon={<CheckIcon size="sm" />}
                  />
                  <Timeline.Item
                    title="Wei Ling joined the workspace"
                    description="Assigned Editor role in Design System"
                    time="09:12"
                    tone="accent"
                  />
                  <Timeline.Item
                    title="Brand refresh moved to Review"
                    description="16 visual regression checks passed"
                    time="Yesterday"
                  />
                </Timeline>
              </Card>
            </Grid>
            <Text size="sm" tone="secondary">
              Tip: switch the Theme toolbar to anime, pixel, brutalist, sketch or neon — or press ⌘K to test CommandPalette.
            </Text>
          </Stack>
        </main>
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          items={[
            { id: 'home', label: 'Overview', group: 'Go to', icon: <HomeIcon size="sm" />, onSelect: () => toast({ title: 'Overview' }) },
            { id: 'settings', label: 'Settings', group: 'Go to', icon: <SettingsIcon size="sm" />, onSelect: () => toast({ title: 'Settings' }) },
            { id: 'new', label: 'New project', group: 'Actions', onSelect: () => toast.success('Project draft created') },
          ]}
        />
      </div>
    );
  },
};
