import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collapsible, Stack, Switch, TextField } from '@yourorg/ui';

const meta = { title: 'Navigation & Layout/Collapsible', component: Collapsible } satisfies Meta<typeof Collapsible>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'Advanced settings' },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <Collapsible {...args}>
        <Stack gap={3}>
          <TextField label="Webhook URL" placeholder="https://" />
          <Switch label="Retry failed deliveries" defaultChecked />
        </Stack>
      </Collapsible>
    </div>
  ),
};
