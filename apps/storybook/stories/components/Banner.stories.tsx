import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner, Button, Stack, toast } from '@yourorg/ui';

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
    if (!visible) {
      return (
        <div style={{ padding: 24 }}>
          <Button size="sm" variant="outline" onClick={() => setVisible(true)}>Restore banner</Button>
        </div>
      );
    }
    return (
      <Banner
        {...args}
        action={<Button size="sm" variant="outline" tone="neutral" onClick={() => toast.info('Opened status page')}>Status page</Button>}
        onDismiss={() => setVisible(false)}
      />
    );
  },
};

export const TonesAndVariants: Story = {
  render: () => (
    <Stack gap={3}>
      {(['info', 'success', 'warning', 'danger', 'accent'] as const).map((tone) => (
        <Banner key={`s-${tone}`} tone={tone} title={`${tone.toUpperCase()} subtle`}>
          Important notice for everyone in this workspace.
        </Banner>
      ))}
      {(['accent', 'danger', 'success'] as const).map((tone) => (
        <Banner key={`f-${tone}`} tone={tone} variant="solid" title={`${tone.toUpperCase()} solid`}>
          High-emphasis announcement bar.
        </Banner>
      ))}
    </Stack>
  ),
};
