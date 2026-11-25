import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl, Stack, ToggleGroup } from '@yourorg/ui';

const meta = { title: 'Inputs & Actions/SegmentedControl', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const SegmentedControlExample: Story = {
  name: 'SegmentedControl and ToggleGroup',
  render: function Render() {
    const [view, setView] = React.useState('board');
    return (
      <Stack gap={6}>
        <SegmentedControl
          aria-label="View"
          value={view}
          onValueChange={setView}
          items={[{ value: 'list', label: 'List' }, { value: 'board', label: 'Board' }, { value: 'calendar', label: 'Calendar' }, { value: 'timeline', label: 'Timeline', disabled: true }]}
        />
        <SegmentedControl aria-label="Billing" size="sm" items={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly (save 20%)' }]} />
        <ToggleGroup aria-label="Text formatting" defaultValue={['bold']}>
          <ToggleGroup.Item value="bold" aria-label="Bold"><strong>B</strong></ToggleGroup.Item>
          <ToggleGroup.Item value="italic" aria-label="Italic"><em>I</em></ToggleGroup.Item>
          <ToggleGroup.Item value="underline" aria-label="Underline"><u>U</u></ToggleGroup.Item>
        </ToggleGroup>
      </Stack>
    );
  },
};
