import type { Meta, StoryObj } from '@storybook/react-vite';
import { PinInput, Stack, toast } from '@yourorg/ui';

const meta = { title: 'Inputs & Actions/PinInput', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const PinInputExample: Story = {
  name: 'PinInput',
  render: () => (
    <Stack gap={6}>
      <PinInput label="Verification code" hint="We sent a 6-digit code to aisha@example.com." onComplete={(code) => toast.success(`Code ${code} entered`)} />
      <PinInput label="PIN" length={4} mask />
    </Stack>
  ),
};
