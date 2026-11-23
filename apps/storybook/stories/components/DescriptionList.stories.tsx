import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, DescriptionList, Grid } from '@yourorg/ui';

const meta = { title: 'Components/Data display/DescriptionList', tags: ['new'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const DescriptionListExample: Story = {
  name: 'DescriptionList',
  render: () => (
    <Grid minChildWidth="320px" gap={8} style={{ maxWidth: 900 }}>
      <DescriptionList columns={2}>
        <DescriptionList.Item term="Order">INV-2041</DescriptionList.Item>
        <DescriptionList.Item term="Status"><Badge tone="success">Paid</Badge></DescriptionList.Item>
        <DescriptionList.Item term="Customer">Umbrella Labs</DescriptionList.Item>
        <DescriptionList.Item term="Total">RM 11,270.00</DescriptionList.Item>
      </DescriptionList>
      <DescriptionList layout="inline">
        <DescriptionList.Item term="Plan">Enterprise</DescriptionList.Item>
        <DescriptionList.Item term="Seats">230</DescriptionList.Item>
        <DescriptionList.Item term="Renews">1 January 2027</DescriptionList.Item>
      </DescriptionList>
    </Grid>
  ),
};
