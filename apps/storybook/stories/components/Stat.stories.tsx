import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, ChartIcon, CheckIcon, Grid, SettingsIcon, Stat, UsersIcon } from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = { title: 'Data Display/Stat', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Stats: Story = {
  render: () => (
    <DemoFrame
      title="Executive KPI metrics"
      description="Responsive metric readouts with icons, positive/negative deltas and invertTrend support for metrics like churn."
      badge="4 KPIs"
      code={`<Card variant="outline">
  <Stat label="Revenue" value="RM 14,504" change={12.4} changeLabel="vs October" icon={<ChartIcon size="sm" />} />
</Card>`}
    >
      <Grid minChildWidth="190px" gap={4}>
        <Card variant="outline"><Stat label="Revenue" value="RM 14,504" change={12.4} changeLabel="vs October" icon={<ChartIcon size="sm" />} /></Card>
        <Card variant="outline"><Stat label="Active users" value="2,318" change={-3.1} changeLabel="vs October" icon={<UsersIcon size="sm" />} /></Card>
        <Card variant="outline"><Stat label="Churn" value="1.9%" change={-0.4} invertTrend changeLabel="vs October" icon={<SettingsIcon size="sm" />} /></Card>
        <Card variant="outline"><Stat label="Uptime SLA" value="99.98%" change={0.1} changeLabel="30-day avg" icon={<CheckIcon size="sm" />} /></Card>
      </Grid>
    </DemoFrame>
  ),
};
