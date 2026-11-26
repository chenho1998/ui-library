import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContextMenu, Menubar, Text, toast } from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = { title: 'Navigation & Layout/Menus', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const MenubarExample: Story = {
  name: 'Menubar',
  render: function Render() {
    const [grid, setGrid] = React.useState(true);
    const [zoom, setZoom] = React.useState('100');
    const run = (title: string) => () => toast.info(title);
    return (
      <DemoFrame
        title="Application menubar"
        description="Desktop-style menu bar with submenus, checkboxes, radio groups and shortcut hints."
        code={`<Menubar>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item shortcut="⌘N">New file</Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar>`}
      >
        <Menubar>
          <Menubar.Menu>
            <Menubar.Trigger>File</Menubar.Trigger>
            <Menubar.Content>
              <Menubar.Item shortcut="⌘N" onSelect={run('New file')}>New file</Menubar.Item>
              <Menubar.Item shortcut="⌘O" onSelect={run('Open')}>Open…</Menubar.Item>
              <Menubar.Sub>
                <Menubar.SubTrigger>Export</Menubar.SubTrigger>
                <Menubar.SubContent>
                  <Menubar.Item onSelect={run('Exported PDF')}>PDF</Menubar.Item>
                  <Menubar.Item onSelect={run('Exported PNG')}>PNG</Menubar.Item>
                </Menubar.SubContent>
              </Menubar.Sub>
              <Menubar.Separator />
              <Menubar.Item tone="danger" onSelect={run('Deleted')}>Delete</Menubar.Item>
            </Menubar.Content>
          </Menubar.Menu>
          <Menubar.Menu>
            <Menubar.Trigger>Edit</Menubar.Trigger>
            <Menubar.Content>
              <Menubar.Item shortcut="⌘Z" onSelect={run('Undo')}>Undo</Menubar.Item>
              <Menubar.Item shortcut="⇧⌘Z" onSelect={run('Redo')}>Redo</Menubar.Item>
            </Menubar.Content>
          </Menubar.Menu>
          <Menubar.Menu>
            <Menubar.Trigger>View</Menubar.Trigger>
            <Menubar.Content>
              <Menubar.CheckboxItem checked={grid} onCheckedChange={(v) => setGrid(v === true)}>Show grid</Menubar.CheckboxItem>
              <Menubar.Separator />
              <Menubar.Label>Zoom</Menubar.Label>
              <Menubar.RadioGroup value={zoom} onValueChange={setZoom}>
                <Menubar.RadioItem value="75">75%</Menubar.RadioItem>
                <Menubar.RadioItem value="100">100%</Menubar.RadioItem>
                <Menubar.RadioItem value="150">150%</Menubar.RadioItem>
              </Menubar.RadioGroup>
            </Menubar.Content>
          </Menubar.Menu>
        </Menubar>
      </DemoFrame>
    );
  },
};

export const ContextMenuExample: Story = {
  name: 'ContextMenu',
  render: () => (
    <DemoFrame
      title="Right-click context menu"
      description="Right-click anywhere inside the canvas below, or focus it and press Shift+F10."
      code={`<ContextMenu>
  <ContextMenu.Trigger asChild><div>Right-click target</div></ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item shortcut="⌘C">Copy</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu>`}
    >
      <ContextMenu>
        <ContextMenu.Trigger asChild>
          {/* Focusable so keyboard users can open the menu with Shift+F10 or the menu key. */}
          <div
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            style={{
              display: 'grid',
              placeItems: 'center',
              height: 156,
              maxWidth: 480,
              border: '1.5px dashed var(--ui-color-border-strong)',
              borderRadius: 12,
              background: 'var(--ui-color-surface-subtle)',
            }}
          >
            <Text size="sm" tone="secondary">Right-click (or focus + Shift+F10) here</Text>
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item shortcut="⌘C" onSelect={() => toast.info('Copied')}>Copy</ContextMenu.Item>
          <ContextMenu.Item shortcut="⌘V" onSelect={() => toast.info('Pasted')}>Paste</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item tone="danger" onSelect={() => toast.error('Deleted')}>Delete</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    </DemoFrame>
  ),
};
