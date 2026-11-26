import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collapsible, Stack, Switch, TextField } from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = { title: 'Navigation & Layout/Collapsible', component: Collapsible } satisfies Meta<typeof Collapsible>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'Advanced webhook settings', defaultOpen: true },
  render: (args) => (
    <DemoFrame
      title="Progressive disclosure"
      description="Expand or collapse secondary settings without leaving the current form."
      code={`<Collapsible title="Advanced webhook settings" defaultOpen>
  <TextField label="Webhook URL" placeholder="https://api.example.com/hook" />
  <Switch label="Retry failed deliveries" defaultChecked />
</Collapsible>`}
    >
      <div style={{ maxWidth: 460 }}>
        <Collapsible {...args}>
          <Stack gap={3}>
            <TextField label="Webhook URL" placeholder="https://api.example.com/hook" />
            <Switch label="Retry failed deliveries" description="Automatically retry up to 3 times with backoff." defaultChecked />
          </Stack>
        </Collapsible>
      </div>
    </DemoFrame>
  ),
};
