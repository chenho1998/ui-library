import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner, Button, Heading, Stack, Text, toast } from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = {
  title: 'Components/Feedback/Banner',
  component: Banner,
  tags: ['new'],
  args: {
    tone: 'info',
    variant: 'subtle',
    title: 'Scheduled maintenance',
    children: 'Read-only mode on Sunday 02:00–03:00 UTC.',
    sticky: false,
    live: false,
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger', 'accent'] },
    variant: { control: 'inline-radio', options: ['subtle', 'solid'] },
    sticky: { control: 'boolean' },
    live: { control: 'boolean' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Full-width announcement strip for page- or app-level messages. Use `Alert` for inline section messages and `toast()` for transient feedback.',
      },
    },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [visible, setVisible] = React.useState(true);
    return (
      <div>
        {visible ? (
          <Banner
            {...args}
            action={
              <Button size="sm" variant="outline" tone="neutral" onClick={() => toast.info('Opened status page')}>
                Status page
              </Button>
            }
            onDismiss={() => setVisible(false)}
          />
        ) : null}
        <Stack gap={2} style={{ padding: 28 }}>
          <Heading level={2} size="lg">Workspace overview</Heading>
          <Text size="sm" tone="secondary">
            Banners sit edge-to-edge above the page header for workspace-wide announcements.
          </Text>
          {!visible ? (
            <div>
              <Button size="sm" variant="outline" onClick={() => setVisible(true)}>Restore banner</Button>
            </div>
          ) : null}
        </Stack>
      </div>
    );
  },
};

export const TonesAndVariants: Story = {
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => (
    <DemoFrame
      title="Banner tones & emphasis"
      description="Use subtle banners for informational notices and solid banners for urgent, high-emphasis announcements."
      badge="8 combinations"
      flush
      maxWidth={920}
      code={`<Banner tone="info" title="Scheduled maintenance">Read-only mode on Sunday 02:00 UTC.</Banner>
<Banner tone="accent" variant="solid" title="v0.3 released">Five new components available.</Banner>`}
    >
      <Stack gap={0}>
        <div style={{ padding: '10px 18px', background: 'var(--ui-color-surface-subtle)', borderBottom: '1px solid var(--ui-color-border)' }}>
          <Text size="xs" weight="semibold" tone="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Subtle (default)
          </Text>
        </div>
        {(['info', 'success', 'warning', 'danger', 'accent'] as const).map((tone) => (
          <Banner key={`s-${tone}`} tone={tone} title={`${tone.charAt(0).toUpperCase()}${tone.slice(1)} notice`}>
            Important notice for everyone in this workspace.
          </Banner>
        ))}
        <div style={{ padding: '10px 18px', background: 'var(--ui-color-surface-subtle)', borderBottom: '1px solid var(--ui-color-border)' }}>
          <Text size="xs" weight="semibold" tone="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Solid (high emphasis)
          </Text>
        </div>
        {(['accent', 'danger', 'success'] as const).map((tone) => (
          <Banner key={`f-${tone}`} tone={tone} variant="solid" title={`${tone.charAt(0).toUpperCase()}${tone.slice(1)} announcement`}>
            High-emphasis announcement bar across the entire app shell.
          </Banner>
        ))}
      </Stack>
    </DemoFrame>
  ),
};
