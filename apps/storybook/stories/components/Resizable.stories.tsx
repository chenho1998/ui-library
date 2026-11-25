import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Heading, Resizable, Text } from '@yourorg/ui';

const meta = {
  title: 'Components/Layout/Resizable',
  component: Resizable,
  tags: ['new'],
  args: { orientation: 'horizontal' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  parameters: {
    docs: {
      description: {
        component: 'Split-pane layout with pointer dragging and WAI-ARIA window-splitter keyboard controls (Arrow keys, Shift+Arrow, Home, End, and Enter or double-click to reset).',
      },
    },
  },
} satisfies Meta<typeof Resizable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ height: 280, border: '1px solid var(--ui-color-border)', borderRadius: 12, overflow: 'hidden' }}>
      <Resizable {...args} defaultSizes={[32, 68]}>
        <Resizable.Panel minSize={20} maxSize={60} style={{ background: 'var(--ui-color-surface-subtle)' }}>
          <Box p={4}>
            <Heading level={3} size="md">Explorer</Heading>
            <Text size="sm" tone="secondary">Drag the divider or focus it and press arrow keys.</Text>
          </Box>
        </Resizable.Panel>
        <Resizable.Handle aria-label="Resize explorer" />
        <Resizable.Panel minSize={30}>
          <Box p={4}>
            <Heading level={3} size="md">Editor</Heading>
            <Text size="sm" tone="secondary">Double-click the divider or press Enter to reset.</Text>
          </Box>
        </Resizable.Panel>
      </Resizable>
    </div>
  ),
};

export const NestedLayout: Story = {
  render: () => (
    <div style={{ height: 340, border: '1px solid var(--ui-color-border)', borderRadius: 12, overflow: 'hidden' }}>
      <Resizable defaultSizes={[28, 72]}>
        <Resizable.Panel minSize={18} style={{ background: 'var(--ui-color-surface-subtle)' }}>
          <Box p={4}><Text weight="semibold">Files</Text></Box>
        </Resizable.Panel>
        <Resizable.Handle aria-label="Resize sidebar" />
        <Resizable.Panel minSize={40}>
          <Resizable orientation="vertical" defaultSizes={[65, 35]}>
            <Resizable.Panel minSize={25}>
              <Box p={4}><Text weight="semibold">Code canvas</Text></Box>
            </Resizable.Panel>
            <Resizable.Handle aria-label="Resize terminal" />
            <Resizable.Panel minSize={20} style={{ background: 'var(--ui-color-surface-subtle)' }}>
              <Box p={4}><Text weight="semibold">Terminal</Text></Box>
            </Resizable.Panel>
          </Resizable>
        </Resizable.Panel>
      </Resizable>
    </div>
  ),
};
