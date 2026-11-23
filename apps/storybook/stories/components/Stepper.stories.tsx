import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Stack, Stepper } from '@yourorg/ui';

const meta = { title: 'Components/Navigation/Stepper', component: Stepper, tags: ['new'] } satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

const steps = [
  { title: 'Account', description: 'Email and password' },
  { title: 'Workspace', description: 'Name and URL' },
  { title: 'Invite team', description: 'Optional' },
  { title: 'Done' },
];

export const Horizontal: Story = {
  args: { steps, current: 1 },
  render: function Render(args) {
    const [current, setCurrent] = React.useState(args.current);
    return (
      <Stack gap={6} style={{ maxWidth: 760 }}>
        <Stepper {...args} current={current} aria-label="Sign-up progress" onStepClick={setCurrent} />
        <Stack direction="row" gap={2}>
          <Button variant="outline" tone="neutral" disabled={current === 0} onClick={() => setCurrent(current - 1)}>Back</Button>
          <Button disabled={current === steps.length - 1} onClick={() => setCurrent(current + 1)}>Next</Button>
        </Stack>
      </Stack>
    );
  },
};

export const Vertical: Story = { args: { steps, current: 2, orientation: 'vertical', 'aria-label': 'Sign-up progress' } };
