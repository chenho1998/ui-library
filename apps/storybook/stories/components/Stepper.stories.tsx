import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Stack, Stepper } from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = { title: 'Navigation & Layout/Stepper', component: Stepper } satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

const steps = [
  { title: 'Account', description: 'Email and password' },
  { title: 'Workspace', description: 'Name and URL' },
  { title: 'Invite team', description: 'Optional' },
  { title: 'Launch', description: 'Publish live' },
];

export const Horizontal: Story = {
  args: { steps, current: 1 },
  render: function Render(args) {
    const [current, setCurrent] = React.useState(args.current);
    return (
      <DemoFrame
        title="Interactive multi-step flow"
        description="Click completed steps or use Back / Next to step through onboarding."
        code={`<Stepper current={current} onStepClick={setCurrent} steps={steps} aria-label="Sign-up progress" />`}
      >
        <Stack gap={6}>
          <Stepper {...args} current={current} aria-label="Sign-up progress" onStepClick={setCurrent} />
          <Stack direction="row" gap={2}>
            <Button size="sm" variant="outline" tone="neutral" disabled={current === 0} onClick={() => setCurrent(current - 1)}>Back</Button>
            <Button size="sm" disabled={current === steps.length - 1} onClick={() => setCurrent(current + 1)}>Next step</Button>
          </Stack>
        </Stack>
      </DemoFrame>
    );
  },
};

export const Vertical: Story = {
  args: { steps, current: 2, orientation: 'vertical', 'aria-label': 'Sign-up progress' },
  render: (args) => (
    <DemoFrame
      title="Vertical checklist stepper"
      description="Ideal for sidebar onboarding checklists and deployment pipelines."
      code={`<Stepper orientation="vertical" current={2} steps={steps} aria-label="Sign-up progress" />`}
    >
      <Stepper {...args} />
    </DemoFrame>
  ),
};
