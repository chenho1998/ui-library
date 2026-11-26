import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Alert, AlertDialog, Avatar, Badge, Breadcrumbs, Button, Card, ColorPicker, Container, Divider, Grid, Heading,
  MoonIcon, Progress, Radio, RadioGroup, SegmentedControl, Select, Stack, SunIcon, Switch, Tabs, Text, TextField,
  Textarea, ThemeProvider, createTheme, toast, useTheme,
} from '@yourorg/ui';

const meta = {
  title: 'Templates/Settings Page',
  tags: ['!autodocs', 'dev'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const SettingsPage: Story = {
  name: 'Settings Page',
  render: function Render() {
    const { colorScheme, setColorScheme } = useTheme();
    const [brand, setBrand] = React.useState('#2c5df5');
    const [density, setDensity] = React.useState('comfortable');
    const [saving, setSaving] = React.useState(false);
    const customTheme = React.useMemo(() => createTheme({ brand }), [brand]);

    const saveProfile = () => {
      setSaving(true);
      window.setTimeout(() => {
        setSaving(false);
        toast.success('Profile updated', { description: 'Changes synced across your workspace.' });
      }, 450);
    };

    return (
      <div style={{ minHeight: '100vh', background: 'var(--ui-color-bg)' }}>
        <header
          style={{
            borderBottom: '1px solid var(--ui-color-border)',
            background: 'var(--ui-color-surface)',
            padding: '18px 24px',
          }}
        >
          <Container size="md">
            <Stack gap={2}>
              <Breadcrumbs items={[{ label: 'Workspace', href: '#' }, { label: 'Settings' }]} />
              <Stack direction="row" justify="between" align="center" gap={3} wrap>
                <Stack direction="row" gap={2} align="center">
                  <Heading level={1} size="2xl">Workspace settings</Heading>
                  <Badge tone="accent">Pro plan</Badge>
                </Stack>
                <Button
                  size="sm"
                  variant="outline"
                  tone="neutral"
                  startIcon={colorScheme === 'dark' ? <SunIcon size="sm" /> : <MoonIcon size="sm" />}
                  onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
                >
                  {colorScheme === 'dark' ? 'Switch to light' : 'Switch to dark'}
                </Button>
              </Stack>
            </Stack>
          </Container>
        </header>

        <Container size="md" style={{ paddingBlock: 28, paddingInline: 24 }}>
          <Tabs defaultValue="profile">
            <Tabs.List aria-label="Settings sections">
              <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
              <Tabs.Trigger value="appearance">Appearance</Tabs.Trigger>
              <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
              <Tabs.Trigger value="danger">Danger zone</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="profile">
              <Stack gap={5}>
                <Card variant="outline">
                  <Stack gap={5}>
                    <Stack direction="row" gap={4} align="center" justify="between" wrap>
                      <Stack direction="row" gap={4} align="center">
                        <Avatar name="Aisha Rahman" size="lg" />
                        <Stack gap={1}>
                          <Text weight="semibold" size="md">Aisha Rahman</Text>
                          <Stack direction="row" gap={2} wrap>
                            <Badge tone="accent" size="sm">Workspace Admin</Badge>
                            <Badge size="sm">Kuala Lumpur (UTC+8)</Badge>
                          </Stack>
                        </Stack>
                      </Stack>
                      <Button size="sm" variant="outline" tone="neutral" onClick={() => toast.info('Avatar upload opened')}>
                        Change avatar
                      </Button>
                    </Stack>

                    <Divider />

                    <Grid minChildWidth="240px" gap={4}>
                      <TextField label="First name" defaultValue="Aisha" />
                      <TextField label="Last name" defaultValue="Rahman" />
                      <TextField label="Email" type="email" defaultValue="aisha@acme.test" hint="Used for invoices and security alerts." />
                      <Select label="Language" defaultValue="en">
                        <Select.Item value="en">English</Select.Item>
                        <Select.Item value="ms">Bahasa Melayu</Select.Item>
                        <Select.Item value="zh">中文</Select.Item>
                      </Select>
                    </Grid>

                    <Textarea label="Bio" maxLength={160} showCount defaultValue="Product designer working on accessible design systems." />

                    <Card.Footer>
                      <Button loading={saving} onClick={saveProfile}>Save changes</Button>
                      <Button variant="ghost" tone="neutral" onClick={() => toast.info('Changes discarded')}>Cancel</Button>
                    </Card.Footer>
                  </Stack>
                </Card>

                <Card variant="subtle" padding="sm">
                  <Stack gap={2}>
                    <Stack direction="row" justify="between" align="center">
                      <Text size="sm" weight="semibold">Seat allocation</Text>
                      <Badge tone="success" size="sm">8 of 15 seats used</Badge>
                    </Stack>
                    <Progress aria-label="Seat usage" value={53} size="sm" />
                  </Stack>
                </Card>
              </Stack>
            </Tabs.Content>

            <Tabs.Content value="appearance">
              <Card variant="outline">
                <Stack gap={5}>
                  <Stack gap={1}>
                    <Heading level={2} size="lg">Brand &amp; display</Heading>
                    <Text size="sm" tone="secondary">Preview your workspace accent colour and interface density live.</Text>
                  </Stack>
                  <Grid minChildWidth="260px" gap={5} style={{ alignItems: 'start' }}>
                    <Stack gap={4}>
                      <ColorPicker label="Workspace brand colour" value={brand} onValueChange={setBrand} />
                      <Stack gap={2}>
                        <Text size="sm" weight="medium">Table &amp; list density</Text>
                        <SegmentedControl
                          aria-label="Interface density"
                          value={density}
                          onValueChange={setDensity}
                          items={[
                            { value: 'compact', label: 'Compact' },
                            { value: 'comfortable', label: 'Comfortable' },
                            { value: 'spacious', label: 'Spacious' },
                          ]}
                        />
                      </Stack>
                    </Stack>
                    <ThemeProvider
                      theme={customTheme}
                      colorScheme={colorScheme}
                      style={{ padding: 18, borderRadius: 12, border: '1px solid var(--ui-color-border)' }}
                    >
                      <Stack gap={3}>
                        <Stack direction="row" justify="between" align="center">
                          <Text weight="semibold">Live preview</Text>
                          <Badge tone="accent">{density}</Badge>
                        </Stack>
                        <Progress label="Token coverage" value={88} showValue />
                        <Stack direction="row" gap={2}>
                          <Button size="sm" onClick={() => toast.success(`Applied ${brand.toUpperCase()}`)}>Apply brand</Button>
                          <Button size="sm" variant="outline">Secondary</Button>
                        </Stack>
                      </Stack>
                    </ThemeProvider>
                  </Grid>
                </Stack>
              </Card>
            </Tabs.Content>

            <Tabs.Content value="notifications">
              <Card variant="outline">
                <Stack gap={4}>
                  <Switch label="Product updates" description="New releases and v0.3 component announcements." defaultChecked />
                  <Switch label="Comments & mentions" description="When a teammate replies to you or mentions @aisha." defaultChecked />
                  <Switch label="Security alerts" description="Unusual sign-ins and API token creation." defaultChecked />
                  <Divider />
                  <RadioGroup label="Email digest cadence" defaultValue="weekly" orientation="horizontal">
                    <Radio value="daily" label="Daily" />
                    <Radio value="weekly" label="Weekly" />
                    <Radio value="never" label="Never" />
                  </RadioGroup>
                </Stack>
              </Card>
            </Tabs.Content>

            <Tabs.Content value="danger">
              <Stack gap={4}>
                <Alert tone="danger" title="Deleting the workspace is permanent">
                  All 12 projects, design token snapshots, and 8 team member accounts will be removed immediately.
                </Alert>
                <Card variant="outline">
                  <Stack direction="row" justify="between" align="center" gap={4} wrap>
                    <Stack gap={1}>
                      <Text weight="semibold">Delete workspace</Text>
                      <Text size="sm" tone="secondary">Permanently erase Acme Design System and cancel billing.</Text>
                    </Stack>
                    <AlertDialog
                      trigger={<Button tone="danger">Delete workspace</Button>}
                      title="Delete this workspace?"
                      description="This removes 12 projects and 8 members. You can't undo this."
                      confirmLabel="Delete workspace"
                      onConfirm={() => toast.error('Workspace scheduled for deletion')}
                    />
                  </Stack>
                </Card>
              </Stack>
            </Tabs.Content>
          </Tabs>
        </Container>
      </div>
    );
  },
};
