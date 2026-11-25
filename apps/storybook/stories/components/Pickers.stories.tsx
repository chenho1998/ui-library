import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker, DateRangePicker, Grid, TimePicker } from '@yourorg/ui';

const meta = { title: 'Inputs & Actions/Date & Time Pickers', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Pickers: Story = {
  render: () => (
    <Grid minChildWidth="260px" gap={6} style={{ maxWidth: 880 }}>
      <DatePicker label="Start date" />
      <TimePicker label="Start time" defaultValue="09:30" />
      <TimePicker label="Reminder" minuteStep={15} hint="Every 15 minutes." />
      <DateRangePicker label="Trip dates" hint="Pick a start, then an end." />
      <DateRangePicker
        label="Report period"
        defaultValue={{ start: new Date(2026, 10, 2), end: new Date(2026, 10, 15) }}
        isDateDisabled={(d) => d > new Date(2026, 11, 31)}
      />
    </Grid>
  ),
};
