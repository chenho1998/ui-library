import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AlertDialog, Button, Dialog, Drawer, DropdownMenu, IconButton, MoreIcon, Popover, Select, Stack, Switch, Text,
  TextField, Tooltip, toast,
} from '@yourorg/ui';

const meta = { title: 'Components/Overlays/Overview' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const DialogExample: Story = {
  name: 'Dialog',
  render: () => (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button>Invite teammate</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Invite a teammate</Dialog.Title>
        <Dialog.Description>They'll get an email with a link to join this workspace.</Dialog.Description>
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
  ),
};

export const Confirm: Story = {
  name: 'AlertDialog',
  render: () => (
    <AlertDialog
      trigger={<Button tone="danger" variant="outline">Delete project</Button>}
      title="Delete “Website redesign”?"
      description="This removes the project and its 24 files for everyone. You can't undo this."
      confirmLabel="Delete project"
      onConfirm={() => new Promise((r) => setTimeout(r, 1000)).then(() => { toast({ title: 'Project deleted', tone: 'success' }); })}
    />
  ),
};

export const DrawerExample: Story = {
  name: 'Drawer',
  render: () => (
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
  ),
};

export const PopoverExample: Story = {
  name: 'Popover',
  render: () => (
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
  ),
};

export const TooltipExample: Story = {
  name: 'Tooltip',
  render: () => (
    <Stack direction="row" gap={4}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} content={`Tooltip on ${side}`} side={side}>
          <Button variant="outline" tone="neutral">{side}</Button>
        </Tooltip>
      ))}
    </Stack>
  ),
};

export const Menu: Story = {
  name: 'DropdownMenu',
  render: function Render() {
    const [density, setDensity] = React.useState('comfortable');
    const [showIds, setShowIds] = React.useState(true);
    return (
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
    );
  },
};
