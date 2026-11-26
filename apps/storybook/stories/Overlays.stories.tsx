import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AlertDialog, Button, Dialog, Drawer, DropdownMenu, IconButton, MoreIcon, Popover, Select, Stack, Switch, Text,
  TextField, Tooltip, toast,
} from '@yourorg/ui';
import { DemoFrame } from './PreviewKit';

const meta = {
  title: 'Overlays & Utilities/Dialogs & Drawers',
  parameters: { controls: { disable: true } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const DialogExample: Story = {
  name: 'Dialog',
  render: () => (
    <DemoFrame
      title="Modal dialog"
      description="Focus-trapped modal with scroll lock, Escape dismissal and ThemeProvider portal inheritance."
      code={`<Dialog>
  <Dialog.Trigger asChild><Button>Invite teammate</Button></Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Invite a teammate</Dialog.Title>
    <Dialog.Body>...</Dialog.Body>
    <Dialog.Footer>...</Dialog.Footer>
  </Dialog.Content>
</Dialog>`}
    >
      <Dialog>
        <Dialog.Trigger asChild>
          <Button>Invite teammate</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Invite a teammate</Dialog.Title>
          <Dialog.Description>They&apos;ll get an email with a link to join this workspace.</Dialog.Description>
          <Dialog.Body>
            <Stack gap={4}>
              <TextField label="Email" type="email" required />
              <Select label="Role" defaultValue="member">
                <Select.Item value="member">Member</Select.Item>
                <Select.Item value="admin">Admin</Select.Item>
              </Select>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button variant="outline" tone="neutral">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button onClick={() => toast.success('Invite sent')}>Send invite</Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </DemoFrame>
  ),
};

export const Confirm: Story = {
  name: 'AlertDialog',
  render: () => (
    <DemoFrame
      title="Destructive confirmation"
      description="Ignores backdrop clicks, focuses Cancel first, and shows a spinner while an async onConfirm promise settles."
      code={`<AlertDialog
  trigger={<Button tone="danger" variant="outline">Delete project</Button>}
  title="Delete project?"
  confirmLabel="Delete project"
  onConfirm={deleteProject}
/>`}
    >
      <AlertDialog
        trigger={<Button tone="danger" variant="outline">Delete project</Button>}
        title="Delete “Website redesign”?"
        description="This removes the project and its 24 files for everyone. You can't undo this."
        confirmLabel="Delete project"
        onConfirm={() => new Promise((r) => setTimeout(r, 1000)).then(() => { toast({ title: 'Project deleted', tone: 'success' }); })}
      />
    </DemoFrame>
  ),
};

export const DrawerExample: Story = {
  name: 'Drawer',
  render: () => (
    <DemoFrame
      title="Slide-over drawer"
      description="Edge-anchored overlay for secondary workflows, filters and mobile navigation."
      code={`<Drawer>
  <Drawer.Trigger asChild><Button variant="outline" tone="neutral">Filters</Button></Drawer.Trigger>
  <Drawer.Content side="right" size="sm">...</Drawer.Content>
</Drawer>`}
    >
      <Drawer>
        <Drawer.Trigger asChild>
          <Button variant="outline" tone="neutral">Filters</Button>
        </Drawer.Trigger>
        <Drawer.Content side="right" size="sm">
          <Drawer.Title>Filters</Drawer.Title>
          <Drawer.Body>
            <Stack gap={4}>
              <Switch label="Only active" defaultChecked />
              <Switch label="Show archived" />
              <TextField label="Owner" />
            </Stack>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close asChild><Button>Apply</Button></Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </DemoFrame>
  ),
};

export const PopoverExample: Story = {
  name: 'Popover',
  render: () => (
    <DemoFrame
      title="Anchored popover"
      description="Non-modal floating panel for quick actions, share controls and pickers."
      code={`<Popover>
  <Popover.Trigger asChild><Button variant="outline" tone="neutral">Share</Button></Popover.Trigger>
  <Popover.Content arrow align="start">...</Popover.Content>
</Popover>`}
    >
      <Popover>
        <Popover.Trigger asChild>
          <Button variant="outline" tone="neutral">Share</Button>
        </Popover.Trigger>
        <Popover.Content arrow align="start">
          <Stack gap={3} style={{ width: 280 }}>
            <Text size="sm" weight="semibold">Share this view</Text>
            <TextField label="Link" readOnly defaultValue="https://app.example.com/v/8f2a" size="sm" />
            <Switch label="Anyone with the link can view" size="sm" />
          </Stack>
        </Popover.Content>
      </Popover>
    </DemoFrame>
  ),
};

export const TooltipExample: Story = {
  name: 'Tooltip',
  render: () => (
    <DemoFrame
      title="Tooltips"
      description="Hover or focus any button to inspect directional tooltip placement."
      code={`<Tooltip content="Tooltip on top" side="top">
  <Button variant="outline" tone="neutral">top</Button>
</Tooltip>`}
    >
      <Stack direction="row" gap={3} wrap>
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip key={side} content={`Tooltip on ${side}`} side={side}>
            <Button variant="outline" tone="neutral">{side}</Button>
          </Tooltip>
        ))}
      </Stack>
    </DemoFrame>
  ),
};

export const Menu: Story = {
  name: 'DropdownMenu',
  render: function Render() {
    const [density, setDensity] = React.useState('comfortable');
    const [showIds, setShowIds] = React.useState(true);
    return (
      <DemoFrame
        title="Dropdown menu"
        description="Supports checkbox items, radio groups, nested submenus, keyboard shortcuts and destructive actions."
        code={`<DropdownMenu>
  <DropdownMenu.Trigger asChild><IconButton aria-label="Options"><MoreIcon /></IconButton></DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item shortcut="⌘E">Export CSV</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>`}
      >
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <IconButton aria-label="Table options" variant="outline"><MoreIcon /></IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Label>View</DropdownMenu.Label>
            <DropdownMenu.CheckboxItem checked={showIds} onCheckedChange={setShowIds}>Show IDs</DropdownMenu.CheckboxItem>
            <DropdownMenu.RadioGroup value={density} onValueChange={setDensity}>
              <DropdownMenu.RadioItem value="comfortable">Comfortable</DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="compact">Compact</DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
            <DropdownMenu.Separator />
            <DropdownMenu.Item shortcut="⌘E" onSelect={() => toast({ title: 'Exported' })}>Export CSV</DropdownMenu.Item>
            <DropdownMenu.Item shortcut="⌘D">Duplicate</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item tone="danger">Delete</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </DemoFrame>
    );
  },
};
