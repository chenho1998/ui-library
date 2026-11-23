import * as React from 'react';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Collapsible, CommandPalette, ContextMenu, DateRangePicker, DescriptionList, FileUpload, HomeIcon, Kbd, Menubar, PinInput, Rating,
  ScrollArea, SegmentedControl, Sidebar, Stat, Stepper, Timeline, TimePicker, TreeView, type TreeNode,
} from '../src';
import { axeViolations, renderUI } from './utils';

const files: TreeNode[] = [
  { id: 'src', label: 'src', children: [{ id: 'a', label: 'a.ts' }, { id: 'b', label: 'b.ts' }] },
  { id: 'readme', label: 'README.md' },
];

function Nav({ defaultCollapsed = false, label = 'Main' }: { defaultCollapsed?: boolean; label?: string }) {
  return (
    <Sidebar aria-label={label} defaultCollapsed={defaultCollapsed}>
      <Sidebar.Header>
        <Sidebar.Toggle />
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Group label="Workspace">
          <Sidebar.Item href="/home" icon={<HomeIcon />} current>Home</Sidebar.Item>
          <Sidebar.Item badge={3}>Inbox</Sidebar.Item>
          <Sidebar.Submenu label="Projects">
            <Sidebar.Item href="/a">Alpha</Sidebar.Item>
          </Sidebar.Submenu>
        </Sidebar.Group>
      </Sidebar.Content>
    </Sidebar>
  );
}

describe('Sidebar', () => {
  it('is a named navigation landmark that marks the current page', () => {
    renderUI(<Nav />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('group', { name: 'Workspace' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Inbox 3' })).toBeInTheDocument();
  });

  it('collapses to icons but keeps every item named, and a submenu expands it again', async () => {
    const user = userEvent.setup();
    renderUI(<Nav />);
    const toggle = screen.getByRole('button', { name: 'Collapse sidebar' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.click(toggle);
    expect(screen.getByRole('navigation')).toHaveAttribute('data-collapsed');
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Projects' }));
    expect(screen.getByRole('navigation')).not.toHaveAttribute('data-collapsed');
    expect(screen.getByRole('button', { name: 'Projects' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Alpha' })).toBeInTheDocument();
  });
});

describe('Stepper', () => {
  it('marks the current step, announces each status and only lets completed steps be revisited', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    renderUI(<Stepper aria-label="Progress" current={1} steps={[{ title: 'Account' }, { title: 'Team' }, { title: 'Done' }]} onStepClick={onStepClick} />);
    const items = within(screen.getByRole('list', { name: 'Progress' })).getAllByRole('listitem');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).toHaveTextContent('Account, completed');
    expect(items[2]).toHaveTextContent('Done, not started');
    expect(screen.getAllByRole('button')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /Account/ }));
    expect(onStepClick).toHaveBeenCalledWith(0);
  });
});

describe('Menus and Collapsible', () => {
  it('Menubar opens a menu and runs an item', async () => {
    const user = userEvent.setup();
    const onNew = vi.fn();
    renderUI(
      <Menubar>
        <Menubar.Menu>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item shortcut="⌘N" onSelect={onNew}>New file</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar>,
    );
    expect(screen.getByRole('menubar')).toBeInTheDocument();
    await user.click(screen.getByRole('menuitem', { name: 'File' }));
    await user.click(await screen.findByRole('menuitem', { name: 'New file' }));
    expect(onNew).toHaveBeenCalledOnce();
  });

  it('ContextMenu opens on right-click', async () => {
    renderUI(
      <ContextMenu>
        <ContextMenu.Trigger>Canvas</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Canvas'));
    expect(await screen.findByRole('menuitem', { name: 'Copy' })).toBeInTheDocument();
  });

  it('Collapsible shows its content when opened', async () => {
    const user = userEvent.setup();
    renderUI(<Collapsible title="Advanced">Webhook settings</Collapsible>);
    const trigger = screen.getByRole('button', { name: 'Advanced' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Webhook settings')).toBeVisible();
  });
});

describe('Inputs', () => {
  it('SegmentedControl switches value and never becomes empty', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderUI(<SegmentedControl aria-label="View" items={[{ value: 'list', label: 'List' }, { value: 'board', label: 'Board' }]} onValueChange={onValueChange} />);
    const group = screen.getByRole('radiogroup', { name: 'View' });
    const [list, board] = within(group).getAllByRole('radio');
    expect(list).toHaveAttribute('aria-checked', 'true');
    await user.click(board!);
    expect(onValueChange).toHaveBeenLastCalledWith('board');
    await user.click(board!);
    expect(board).toHaveAttribute('aria-checked', 'true');
  });

  it('PinInput moves forward as you type, completes, handles Backspace and paste', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    renderUI(<PinInput label="Code" length={4} onComplete={onComplete} />);
    const boxes = screen.getAllByRole('textbox');
    expect(boxes[0]).toHaveAccessibleName('Digit 1 of 4');
    await user.click(boxes[0]!);
    await user.keyboard('12a3');
    expect(boxes[2]).toHaveValue('3');
    expect(boxes[3]).toHaveFocus();
    await user.keyboard('4');
    expect(onComplete).toHaveBeenCalledWith('1234');
    await user.keyboard('{Backspace}');
    expect(boxes[3]).toHaveValue('');
    await user.click(boxes[0]!);
    await user.paste('9876');
    expect(boxes.map((b) => (b as HTMLInputElement).value).join('')).toBe('9876');
  });

  it('FileUpload lists chosen files, rejects ones that are too big, and removes files', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const onReject = vi.fn();
    renderUI(<FileUpload label="Attachments" multiple maxSize={10} onReject={onReject} />);
    const input = screen.getByLabelText('Attachments');
    await user.upload(input, [new File(['tiny'], 'notes.txt', { type: 'text/plain' }), new File(['far too large'], 'big.txt', { type: 'text/plain' })]);
    expect(screen.getByText('notes.txt')).toBeInTheDocument();
    expect(screen.queryByText('big.txt')).not.toBeInTheDocument();
    expect(onReject).toHaveBeenCalledWith([expect.objectContaining({ reason: 'size' })]);
    await user.click(screen.getByRole('button', { name: 'Remove notes.txt' }));
    expect(screen.queryByText('notes.txt')).not.toBeInTheDocument();
  });

  it('Rating is a group of radios; read-only shows the score as an image', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderUI(
      <>
        <Rating label="Your rating" onValueChange={onValueChange} />
        <Rating label="Average" value={3} readOnly />
      </>,
    );
    const group = screen.getByRole('group', { name: 'Your rating' });
    await user.click(within(group).getByRole('radio', { name: '4 of 5 stars' }));
    expect(onValueChange).toHaveBeenCalledWith(4);
    expect(screen.getByRole('img', { name: '3 of 5 stars' })).toBeInTheDocument();
  });
});

describe('Pickers', () => {
  it('TimePicker picks hours and minutes with the keyboard', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = renderUI(
      <form>
        <TimePicker label="Start" defaultValue="09:30" name="start" onValueChange={onValueChange} />
      </form>,
    );
    await user.click(screen.getByRole('button', { name: /Start/ }));
    const hours = await screen.findByRole('listbox', { name: 'Hours' });
    await waitFor(() => expect(hours).toHaveFocus());
    await user.keyboard('{ArrowDown}');
    expect(onValueChange).toHaveBeenLastCalledWith('10:30');
    act(() => screen.getByRole('listbox', { name: 'Minutes' }).focus());
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('10:35');
    expect(new FormData(container.querySelector('form')!).get('start')).toBe('10:35');
  });

  it('DateRangePicker orders the two picked dates', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderUI(<DateRangePicker label="Trip" locale="en-US" defaultValue={{ start: new Date(2026, 10, 1), end: new Date(2026, 10, 2) }} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: /Trip/ }));
    await user.click(await screen.findByRole('button', { name: 'Tuesday, November 10, 2026' }));
    await user.click(screen.getByRole('button', { name: 'Thursday, November 5, 2026' }));
    expect(onValueChange).toHaveBeenCalledWith({ start: new Date(2026, 10, 5), end: new Date(2026, 10, 10) });
  });
});

describe('Overlays and utilities', () => {
  it('CommandPalette opens with Ctrl+K, filters by keywords and runs the active item with Enter', async () => {
    const user = userEvent.setup();
    const onTeam = vi.fn();
    renderUI(
      <CommandPalette
        items={[
          { id: 'home', label: 'Home', group: 'Go to', onSelect: () => {} },
          { id: 'team', label: 'Team members', group: 'Go to', keywords: ['people'], onSelect: onTeam },
        ]}
      />,
    );
    await user.keyboard('{Control>}k{/Control}');
    const input = await screen.findByRole('combobox', { name: 'Command palette' });
    await user.type(input, 'people');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Team members' }).id);
    await user.keyboard('{Enter}');
    expect(onTeam).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('Kbd and ScrollArea render accessible markup', () => {
    renderUI(
      <>
        <Kbd>⌘</Kbd>
        <ScrollArea aria-label="Notes" style={{ height: 100 }}>Long text</ScrollArea>
      </>,
    );
    expect(screen.getByText('⌘').tagName).toBe('KBD');
    expect(screen.getByRole('region', { name: 'Notes' })).toHaveAttribute('tabindex', '0');
  });
});

describe('Data display', () => {
  it('TreeView follows the WAI-ARIA tree keyboard model', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderUI(<TreeView aria-label="Files" items={files} onSelect={onSelect} />);
    const src = screen.getByRole('treeitem', { name: 'src' });
    expect(src).toHaveAttribute('aria-expanded', 'false');
    act(() => src.focus());
    await user.keyboard('{ArrowRight}');
    expect(src).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('treeitem', { name: 'a.ts' })).toHaveFocus();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledWith('b');
    expect(screen.getByRole('treeitem', { name: 'b.ts' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowLeft}');
    expect(src).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(src).toHaveAttribute('aria-expanded', 'false');
    await user.keyboard('{End}');
    expect(screen.getByRole('treeitem', { name: 'README.md' })).toHaveFocus();
  });

  it('Stat shows a trend whose colour follows invertTrend; Timeline and DescriptionList use list semantics', () => {
    renderUI(
      <>
        <Stat label="Revenue" value="RM 10" change={12} />
        <Stat label="Churn" value="2%" change={-1} invertTrend />
        <Timeline>
          <Timeline.Item title="Paid" time={new Date(2026, 10, 23, 10, 24)} />
        </Timeline>
        <DescriptionList>
          <DescriptionList.Item term="Plan">Pro</DescriptionList.Item>
        </DescriptionList>
      </>,
    );
    expect(screen.getByText('+12%').closest('dd')).toHaveAttribute('data-trend', 'good');
    expect(screen.getByText('-1%').closest('dd')).toHaveAttribute('data-trend', 'good');
    expect(screen.getByRole('listitem')).toHaveTextContent('Paid');
    expect(screen.getByRole('time')).toHaveAttribute('datetime', new Date(2026, 10, 23, 10, 24).toISOString());
    expect(screen.getByText('Plan').tagName).toBe('DT');
    expect(screen.getByText('Pro').tagName).toBe('DD');
  });
});

describe('Accessibility (axe) of the new components', () => {
  it('has no violations', async () => {
    const { container } = renderUI(
      <main>
        <Nav />
        <Nav defaultCollapsed label="Compact" />
        <Stepper aria-label="Progress" current={1} steps={[{ title: 'One' }, { title: 'Two' }]} />
        <Collapsible title="More">Details</Collapsible>
        <SegmentedControl aria-label="View" items={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} />
        <PinInput label="Code" length={4} />
        <FileUpload label="Files" />
        <Rating label="Rating" />
        <Rating label="Average" value={4} readOnly />
        <TimePicker label="Time" />
        <DateRangePicker label="Dates" />
        <ScrollArea aria-label="Notes">Text</ScrollArea>
        <TreeView aria-label="Files tree" items={files} />
        <Stat label="Revenue" value="RM 10" change={2} />
        <Timeline>
          <Timeline.Item title="Paid" />
        </Timeline>
        <DescriptionList>
          <DescriptionList.Item term="Plan">Pro</DescriptionList.Item>
        </DescriptionList>
        <Menubar>
          <Menubar.Menu>
            <Menubar.Trigger>File</Menubar.Trigger>
          </Menubar.Menu>
        </Menubar>
      </main>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
