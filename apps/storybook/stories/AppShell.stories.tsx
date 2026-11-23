import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button, Card, CheckIcon, CommandPalette, Grid, Heading, HomeIcon, Kbd, SearchIcon, SettingsIcon, Stack, Stat, Stepper, Text, Timeline, toast,
} from '@yourorg/ui';
import { AppNav } from './components/Sidebar.stories';

const meta = { title: 'Patterns/App shell', parameters: { layout: 'fullscreen' }, tags: ['new'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

/** Sidebar, command palette, stats, a stepper and a timeline working together. Try it with every theme. */
export const Dashboard: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <AppNav />
        <main style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
          <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 32px', borderBottom: '1px solid var(--ui-color-border)' }}>
            <Heading level={1} size="xl">Home</Heading>
            <Button variant="outline" tone="neutral" size="sm" startIcon={<SearchIcon size="sm" />} style={{ marginInlineStart: 'auto' }} onClick={() => setOpen(true)}>
              Search <Kbd>⌘</Kbd><Kbd>K</Kbd>
            </Button>
            <Button size="sm">New project</Button>
          </header>
          <Stack gap={6} style={{ padding: 32 }}>
            <Grid minChildWidth="200px" gap={4}>
              <Card variant="outline"><Stat label="Revenue" value="RM 14,504" change={12.4} changeLabel="vs October" /></Card>
              <Card variant="outline"><Stat label="Active users" value="2,318" change={4.2} changeLabel="vs October" /></Card>
              <Card variant="outline"><Stat label="Churn" value="1.9%" change={-0.4} invertTrend changeLabel="vs October" /></Card>
            </Grid>
            <Grid minChildWidth="320px" gap={4}>
              <Card variant="outline">
                <Card.Header><Card.Title>Onboarding</Card.Title></Card.Header>
                <Stepper aria-label="Onboarding progress" orientation="vertical" current={2} steps={[{ title: 'Create workspace' }, { title: 'Invite team' }, { title: 'Connect billing' }, { title: 'Launch' }]} />
              </Card>
              <Card variant="outline">
                <Card.Header><Card.Title>Activity</Card.Title></Card.Header>
                <Timeline>
                  <Timeline.Item title="Invoice INV-2041 paid" time="10:24" tone="success" icon={<CheckIcon size="sm" />} />
                  <Timeline.Item title="Wei Ling joined the workspace" time="09:12" tone="accent" />
                  <Timeline.Item title="Brand refresh moved to Review" time="Yesterday" />
                </Timeline>
              </Card>
            </Grid>
            <Text size="sm" tone="secondary">Tip: switch the Theme toolbar to anime, pixel, brutalist, sketch or neon.</Text>
          </Stack>
        </main>
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          items={[
            { id: 'home', label: 'Home', group: 'Go to', icon: <HomeIcon size="sm" />, onSelect: () => toast({ title: 'Home' }) },
            { id: 'settings', label: 'Settings', group: 'Go to', icon: <SettingsIcon size="sm" />, onSelect: () => toast({ title: 'Settings' }) },
            { id: 'new', label: 'New project', group: 'Actions', onSelect: () => toast({ title: 'New project' }) },
          ]}
        />
      </div>
    );
  },
};
