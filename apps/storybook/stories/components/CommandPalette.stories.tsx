import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button, ChartIcon, CommandPalette, FileIcon, HomeIcon, Kbd, PlusIcon, SearchIcon, SettingsIcon, Stack, Text, UsersIcon,
  toast, type CommandItem,
} from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = { title: 'Overlays & Utilities/CommandPalette', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const go = (title: string) => () => toast.info(`Navigated to ${title}`);

const commands: CommandItem[] = [
  { id: 'home', label: 'Home', group: 'Go to', icon: <HomeIcon size="sm" />, onSelect: go('Home') },
  { id: 'reports', label: 'Reports', group: 'Go to', icon: <ChartIcon size="sm" />, keywords: ['analytics', 'charts'], onSelect: go('Reports') },
  { id: 'team', label: 'Team members', group: 'Go to', icon: <UsersIcon size="sm" />, keywords: ['people'], onSelect: go('Team') },
  { id: 'settings', label: 'Settings', group: 'Go to', icon: <SettingsIcon size="sm" />, shortcut: '⌘,', onSelect: go('Settings') },
  { id: 'new-project', label: 'New project', group: 'Actions', icon: <PlusIcon size="sm" />, shortcut: '⌘N', onSelect: go('New project') },
  { id: 'new-doc', label: 'New document', group: 'Actions', icon: <FileIcon size="sm" />, onSelect: go('New document') },
  { id: 'archive', label: 'Archive workspace', group: 'Actions', disabled: true, onSelect: go('Archived') },
];

export const Command: Story = {
  name: 'CommandPalette',
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    return (
      <DemoFrame
        title="Quick-action command palette"
        description="Click the trigger or press ⌘K / Ctrl+K anywhere to search grouped commands by label or keyword."
        badge="⌘K shortcut"
        code={`<CommandPalette items={commands} open={open} onOpenChange={setOpen} />`}
      >
        <Stack gap={3} align="start">
          <Button variant="outline" tone="neutral" startIcon={<SearchIcon size="sm" />} onClick={() => setOpen(true)}>
            Search commands… <Kbd>⌘</Kbd><Kbd>K</Kbd>
          </Button>
          <Text size="sm" tone="secondary">
            Try typing <code>analytics</code> or <code>people</code> to test keyword matching.
          </Text>
          <CommandPalette items={commands} open={open} onOpenChange={setOpen} />
        </Stack>
      </DemoFrame>
    );
  },
};
