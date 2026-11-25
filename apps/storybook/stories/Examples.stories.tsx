import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Alert, AlertDialog, Avatar, Badge, Breadcrumbs, Button, Card, Container, Divider, Grid, Heading, RadioGroup, Radio,
  Select, Stack, Switch, Tabs, Text, TextField, Textarea, toast, useTheme,
} from '@yourorg/ui';

const meta = {
  title: 'Patterns/Settings page',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function SchemePicker() {
  const { colorScheme } = useTheme();
  return <Text size="sm" tone="secondary">Current scheme: {colorScheme}</Text>;
}

export const SettingsPage: Story = {
  render: () => (
    <Container size="md" style={{ paddingBlock: 32 }}>
      <Stack gap={6}>
        <Stack gap={2}>
          <Breadcrumbs items={[{ label: 'Workspace', href: '#' }, { label: 'Settings' }]} />
          <Heading level={1}>Settings</Heading>
          <SchemePicker />
        </Stack>
        <Tabs defaultValue="profile">
          <Tabs.List aria-label="Settings sections">
            <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
            <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
            <Tabs.Trigger value="danger">Danger zone</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="profile">
            <Card>
              <Stack direction="row" gap={4} align="center">
                <Avatar name="Aisha Rahman" size="lg" />
                <Stack gap={1}>
                  <Text weight="semibold">Aisha Rahman</Text>
                  <Stack direction="row" gap={2}><Badge tone="accent">Admin</Badge><Badge>Kuala Lumpur</Badge></Stack>
                </Stack>
              </Stack>
              <Divider />
              <Grid columns={2} gap={4}>
                <TextField label="First name" defaultValue="Aisha" />
                <TextField label="Last name" defaultValue="Rahman" />
                <TextField label="Email" type="email" defaultValue="aisha@example.com" />
                <Select label="Language" defaultValue="en">
                  <Select.Item value="en">English</Select.Item>
                  <Select.Item value="ms">Bahasa Melayu</Select.Item>
                  <Select.Item value="zh">中文</Select.Item>
                </Select>
              </Grid>
              <Textarea label="Bio" maxLength={160} showCount defaultValue="Product designer working on design systems." />
              <Card.Footer>
                <Button onClick={() => toast.success('Profile saved')}>Save changes</Button>
                <Button variant="ghost" tone="neutral">Cancel</Button>
              </Card.Footer>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="notifications">
            <Card>
              <Switch label="Product updates" description="New features and improvements, about once a month." defaultChecked />
              <Switch label="Comments" description="When someone replies to you or mentions you." defaultChecked />
              <Divider />
              <RadioGroup label="Email digest" defaultValue="weekly" orientation="horizontal">
                <Radio value="daily" label="Daily" />
                <Radio value="weekly" label="Weekly" />
                <Radio value="never" label="Never" />
              </RadioGroup>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="danger">
            <Stack gap={4}>
              <Alert tone="danger" title="Deleting the workspace is permanent">All projects, files and members are removed.</Alert>
              <AlertDialog
                trigger={<Button tone="danger" style={{ width: 'fit-content' }}>Delete workspace</Button>}
                title="Delete this workspace?"
                description="This removes 12 projects and 8 members. You can't undo this."
                confirmLabel="Delete workspace"
              />
            </Stack>
          </Tabs.Content>
        </Tabs>
      </Stack>
    </Container>
  ),
};
