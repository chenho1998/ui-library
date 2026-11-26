import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Rating, Stack, Text, toast } from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = { title: 'Inputs & Actions/Rating', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const labels = ['Not rated', 'Poor', 'Fair', 'Good', 'Great', 'Outstanding'];

export const RatingExample: Story = {
  name: 'Rating',
  render: function Render() {
    const [score, setScore] = React.useState(4);
    return (
      <DemoFrame
        title="Interactive & read-only ratings"
        description="Arrow-key navigable star rating with allowClear support and compact read-only display."
        code={`<Rating label="How was your stay?" allowClear value={score} onValueChange={setScore} />
<Rating label="Average rating" value={3} readOnly size="sm" />`}
      >
        <Stack gap={5}>
          <Stack gap={2}>
            <Rating
              label="How was your stay?"
              allowClear
              value={score}
              onValueChange={(v) => {
                setScore(v);
                toast.info(`Rated ${v} / 5 — ${labels[v] ?? ''}`);
              }}
            />
            <Stack direction="row" gap={2} align="center">
              <Badge size="sm" tone={score >= 4 ? 'success' : score > 0 ? 'info' : 'neutral'}>
                {score} / 5
              </Badge>
              <Text size="xs" tone="secondary">{labels[score]} · click active star again to clear</Text>
            </Stack>
          </Stack>
          <Rating label="Average rating (read-only)" value={4} readOnly size="sm" />
        </Stack>
      </DemoFrame>
    );
  },
};
