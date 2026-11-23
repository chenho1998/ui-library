import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, Button, Progress, Skeleton, Spinner, Stack, toast } from '@yourorg/ui';

const meta = { title: 'Components/Feedback/Overview' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Alerts: Story = {
  render: () => (
    <Stack gap={3} style={{ maxWidth: 640 }}>
      <Alert tone="info" title="Scheduled maintenance">The dashboard will be read-only on Sunday 02:00–03:00.</Alert>
      <Alert tone="success" title="Payment received">Your invoice INV-2041 is paid.</Alert>
      <Alert tone="warning" title="Trial ends in 3 days" actions={<Button size="sm">Upgrade</Button>} onDismiss={() => {}}>
        Upgrade to keep your projects and history.
      </Alert>
      <Alert tone="danger" title="Couldn't save changes">Check your connection and try again.</Alert>
    </Stack>
  ),
};

export const Toasts: Story = {
  render: () => (
    <Stack direction="row" gap={2} wrap>
      <Button variant="outline" tone="neutral" onClick={() => toast({ title: 'Draft saved' })}>Info</Button>
      <Button variant="outline" tone="neutral" onClick={() => toast.success('Invite sent', { description: 'aisha@example.com will get an email.' })}>Success</Button>
      <Button variant="outline" tone="neutral" onClick={() => toast({ title: 'Storage almost full', tone: 'warning', action: { label: 'Manage storage', onClick: () => {} } })}>Warning with action</Button>
      <Button variant="outline" tone="neutral" onClick={() => toast.error('Upload failed', { description: 'File is larger than 25 MB.' })}>Danger (stays)</Button>
      <Button variant="ghost" tone="neutral" onClick={() => toast.dismiss()}>Dismiss all</Button>
    </Stack>
  ),
};

export const ProgressAndLoading: Story = {
  render: function Render() {
    const [v, setV] = React.useState(35);
    return (
      <Stack gap={5} style={{ maxWidth: 480 }}>
        <Progress label="Uploading report.pdf" value={v} showValue />
        <Progress label="Storage used" value={92} tone="warning" showValue size="sm" />
        <Progress aria-label="Loading" value={null} />
        <Stack direction="row" gap={2}>
          <Button size="sm" variant="outline" tone="neutral" onClick={() => setV((x) => Math.max(0, x - 10))}>−10</Button>
          <Button size="sm" variant="outline" tone="neutral" onClick={() => setV((x) => Math.min(100, x + 10))}>+10</Button>
        </Stack>
        <Stack direction="row" gap={4} align="center">
          <Spinner size="sm" /><Spinner /><Spinner size="lg" />
        </Stack>
        <Stack direction="row" gap={3} align="center">
          <Skeleton shape="circle" width={40} />
          <div style={{ flex: 1 }}><Skeleton lines={3} /></div>
        </Stack>
      </Stack>
    );
  },
};
