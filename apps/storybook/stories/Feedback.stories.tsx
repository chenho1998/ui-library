import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, Button, Progress, Skeleton, Spinner, Stack, toast } from '@yourorg/ui';
import { DemoFrame } from './PreviewKit';

const meta = {
  title: 'Feedback/Alerts & Toasts',
  parameters: { controls: { disable: true } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Alerts: Story = {
  render: () => (
    <DemoFrame
      title="Inline alerts"
      description="Contextual section feedback in four semantic tones, with optional actions and dismiss."
      badge="4 tones"
      maxWidth={760}
      code={`<Alert tone="info" title="Scheduled maintenance">Read-only on Sunday 02:00–03:00.</Alert>
<Alert tone="warning" title="Trial ends in 3 days" actions={<Button size="sm">Upgrade</Button>} onDismiss={() => {}} />`}
    >
      <Stack gap={3}>
        <Alert tone="info" title="Scheduled maintenance">The dashboard will be read-only on Sunday 02:00–03:00.</Alert>
        <Alert tone="success" title="Payment received">Your invoice INV-2041 is paid.</Alert>
        <Alert tone="warning" title="Trial ends in 3 days" actions={<Button size="sm">Upgrade</Button>} onDismiss={() => {}}>
          Upgrade to keep your projects and history.
        </Alert>
        <Alert tone="danger" title="Couldn't save changes">Check your connection and try again.</Alert>
      </Stack>
    </DemoFrame>
  ),
};

export const Toasts: Story = {
  render: () => (
    <DemoFrame
      title="Toast notifications"
      description="Imperative toast.info, toast.success, toast.warning, toast.error and toast.promise helpers."
      maxWidth={760}
      code={`toast.success('Invite sent', { description: 'aisha@example.com will get an email.' });
toast.error('Upload failed', { description: 'File is larger than 25 MB.' });`}
    >
      <Stack direction="row" gap={2} wrap>
        <Button variant="outline" tone="neutral" onClick={() => toast.info('Draft saved')}>Info</Button>
        <Button variant="outline" tone="neutral" onClick={() => toast.success('Invite sent', { description: 'aisha@example.com will get an email.' })}>Success</Button>
        <Button variant="outline" tone="neutral" onClick={() => toast.warning('Storage almost full', { action: { label: 'Manage storage', onClick: () => {} } })}>Warning with action</Button>
        <Button variant="outline" tone="neutral" onClick={() => toast.error('Upload failed', { description: 'File is larger than 25 MB.' })}>Danger (stays)</Button>
        <Button variant="ghost" tone="neutral" onClick={() => toast.dismiss()}>Dismiss all</Button>
      </Stack>
    </DemoFrame>
  ),
};

export const ProgressAndLoading: Story = {
  render: function Render() {
    const [v, setV] = React.useState(35);
    return (
      <DemoFrame
        title="Progress, spinners & skeletons"
        description="Determinate and indeterminate progress bars, spinners and content skeleton placeholders."
        maxWidth={680}
        code={`<Progress label="Uploading report.pdf" value={35} showValue />
<Spinner />
<Skeleton lines={3} />`}
      >
        <Stack gap={5}>
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
      </DemoFrame>
    );
  },
};
