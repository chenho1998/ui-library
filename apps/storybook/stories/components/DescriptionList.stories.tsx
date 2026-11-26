import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Card, DescriptionList, Grid } from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = { title: 'Data Display/DescriptionList', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const DescriptionListExample: Story = {
  name: 'DescriptionList',
  render: () => (
    <DemoFrame
      title="Stacked & inline metadata grids"
      description="Semantic <dl>/<dt>/<dd> layouts for invoices, account specs and entity summaries."
      badge="2 layouts"
      code={`<DescriptionList columns={2}>
  <DescriptionList.Item term="Order">INV-2041</DescriptionList.Item>
  <DescriptionList.Item term="Status"><Badge tone="success">Paid</Badge></DescriptionList.Item>
</DescriptionList>`}
    >
      <Grid minChildWidth="280px" gap={5}>
        <Card variant="outline">
          <Card.Header>
            <Card.Title level={3}>Invoice summary</Card.Title>
            <Card.Description>Two-column stacked grid</Card.Description>
          </Card.Header>
          <DescriptionList columns={2}>
            <DescriptionList.Item term="Order">INV-2041</DescriptionList.Item>
            <DescriptionList.Item term="Status"><Badge tone="success">Paid</Badge></DescriptionList.Item>
            <DescriptionList.Item term="Customer">Umbrella Labs</DescriptionList.Item>
            <DescriptionList.Item term="Total">RM 11,270.00</DescriptionList.Item>
          </DescriptionList>
        </Card>
        <Card variant="outline">
          <Card.Header>
            <Card.Title level={3}>Subscription</Card.Title>
            <Card.Description>Inline key-value list</Card.Description>
          </Card.Header>
          <DescriptionList layout="inline">
            <DescriptionList.Item term="Plan">Enterprise</DescriptionList.Item>
            <DescriptionList.Item term="Seats">230 active</DescriptionList.Item>
            <DescriptionList.Item term="Renews">1 January 2027</DescriptionList.Item>
          </DescriptionList>
        </Card>
      </Grid>
    </DemoFrame>
  ),
};
