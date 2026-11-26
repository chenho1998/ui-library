import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, PinInput, toast } from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = { title: 'Inputs & Actions/PinInput', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const PinInputExample: Story = {
  name: 'PinInput',
  render: () => (
    <DemoFrame
      title="One-time code & masked PIN"
      description="Auto-advances on entry, supports clipboard paste splitting and optional masking."
      badge="OTP · Masked"
      code={`<PinInput label="Verification code" onComplete={(code) => verify(code)} />
<PinInput label="Security PIN" length={4} mask />`}
    >
      <Grid minChildWidth="280px" gap={6}>
        <PinInput
          label="Verification code"
          hint="Paste or type a 6-digit code sent to aisha@example.com."
          onComplete={(code) => toast.success(`Code ${code} verified`)}
        />
        <PinInput label="Security PIN" length={4} mask hint="4-digit masked PIN." />
      </Grid>
    </DemoFrame>
  ),
};
