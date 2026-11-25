import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Grid, Stat, UsersIcon } from '@yourorg/ui';

const meta = { title: 'Data Display/Stat', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Stats: Story = {
  render: () => (
    <Grid minChildWidth="200px" gap={4} style={{ maxWidth: 900 }}>
      <Card variant="outline"><Stat label="Revenue" value="RM 14,504" change={12.4} changeLabel="vs October" /></Card>
      <Card variant="outline"><Stat label="Active users" value="2,318" change={-3.1} changeLabel="vs October" icon={<UsersIcon size="sm" />} /></Card>
      <Card variant="outline"><Stat label="Churn" value="1.9%" change={-0.4} invertTrend changeLabel="vs October" /></Card>
      <Card variant="outline"><Stat label="Open tickets" value="42" change={0} changeLabel="no change" /></Card>
    </Grid>
  ),
};
