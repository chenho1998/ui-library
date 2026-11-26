import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, SegmentedControl, Stack, Text, ToggleGroup } from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = { title: 'Inputs & Actions/SegmentedControl', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const SegmentedControlExample: Story = {
  name: 'SegmentedControl and ToggleGroup',
  render: function Render() {
    const [view, setView] = React.useState('board');
    const [billing, setBilling] = React.useState('yearly');
    return (
      <DemoFrame
        title="Segmented view switcher & ToggleGroup"
        description="Use SegmentedControl for 2–4 mutually exclusive view modes and ToggleGroup for multi-select formatting."
        code={`<SegmentedControl aria-label="View" value={view} onValueChange={setView} items={[...]} />
<ToggleGroup aria-label="Text formatting" defaultValue={['bold']}>...</ToggleGroup>`}
      >
        <Stack gap={5}>
          <Stack gap={2}>
            <SegmentedControl
              aria-label="View"
              value={view}
              onValueChange={setView}
              items={[
                { value: 'list', label: 'List' },
                { value: 'board', label: 'Board' },
                { value: 'calendar', label: 'Calendar' },
                { value: 'timeline', label: 'Timeline', disabled: true },
              ]}
            />
            <Text size="xs" tone="secondary">Active workspace view: <Badge size="sm" tone="accent">{view}</Badge></Text>
          </Stack>
          <SegmentedControl
            aria-label="Billing"
            size="sm"
            value={billing}
            onValueChange={setBilling}
            items={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly (save 20%)' },
            ]}
          />
          <ToggleGroup aria-label="Text formatting" defaultValue={['bold']}>
            <ToggleGroup.Item value="bold" aria-label="Bold"><strong>B</strong></ToggleGroup.Item>
            <ToggleGroup.Item value="italic" aria-label="Italic"><em>I</em></ToggleGroup.Item>
            <ToggleGroup.Item value="underline" aria-label="Underline"><u>U</u></ToggleGroup.Item>
          </ToggleGroup>
        </Stack>
      </DemoFrame>
    );
  },
};
