import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckIcon, PlusIcon, Timeline } from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = { title: 'Data Display/Timeline', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const TimelineExample: Story = {
  name: 'Timeline',
  render: () => (
    <DemoFrame
      title="Activity & shipment timeline"
      description="Chronological vertical log with semantic status markers, custom icons and timestamps."
      code={`<Timeline aria-label="Order history">
  <Timeline.Item title="Delivered" time="Today, 10:24" tone="success" icon={<CheckIcon size="sm" />}>
    Signed for by A. Rahman.
  </Timeline.Item>
</Timeline>`}
    >
      <div style={{ maxWidth: 520 }}>
        <Timeline aria-label="Order history">
          <Timeline.Item title="Delivered" time="Today, 10:24" tone="success" icon={<CheckIcon size="sm" />}>Signed for by A. Rahman.</Timeline.Item>
          <Timeline.Item title="Out for delivery" time="Today, 08:02" tone="accent">Courier departed Klang Valley hub.</Timeline.Item>
          <Timeline.Item title="Shipped from Shah Alam" time="Yesterday, 16:45">Tracking number MY-2041-7781.</Timeline.Item>
          <Timeline.Item title="Order placed" time="21 Nov, 21:10" icon={<PlusIcon size="sm" />}>Payment confirmed via FPX.</Timeline.Item>
        </Timeline>
      </div>
    </DemoFrame>
  ),
};
