import * as React from 'react';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Accordion, Alert, AlertDialog, Avatar, Badge, Breadcrumbs, Button, Card, Checkbox, Combobox, DatePicker, Calendar, Dialog,
  DropdownMenu, EmptyState, Field, Heading, IconButton, NumberField, Pagination, Progress, Radio, RadioGroup, Select,
  Slider, Spinner, Stack, Switch, Table, Tabs, Tag, TextField, Textarea, Toaster, Tooltip, createTheme, getPageRange, toast,
  XIcon,
} from '../src';
import { axeViolations, renderUI } from './utils';

describe('Button', () => {
  it('defaults to type="button" and fires onClick', async () => {
    const onClick = vi.fn();
    renderUI(<Button onClick={onClick}>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toHaveAttribute('type', 'button');
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('ignores clicks and sets aria-busy while loading', async () => {
    const onClick = vi.fn();
    renderUI(<Button loading onClick={onClick}>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders the child element with asChild', () => {
    renderUI(<Button asChild><a href="/docs">Docs</a></Button>);
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveClass('ui-button');
    expect(link).not.toHaveAttribute('type');
  });

  it('IconButton exposes its aria-label', () => {
    renderUI(<IconButton aria-label="Close"><XIcon /></IconButton>);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});

describe('TextField', () => {
  it('links label, hint and error to the input', () => {
    renderUI(<TextField label="Email" hint="We never share it" error="Enter a valid email" required />);
    const input = screen.getByLabelText(/Email/);
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('We never share it Enter a valid email');
  });

  it('counts characters', async () => {
    renderUI(<TextField label="Bio" maxLength={20} showCount />);
    await userEvent.type(screen.getByLabelText('Bio'), 'hello');
    expect(screen.getByText('5 / 20')).toBeInTheDocument();
  });

  it('Textarea is labelled', () => {
    renderUI(<Textarea label="Notes" />);
    expect(screen.getByLabelText('Notes').tagName).toBe('TEXTAREA');
  });
});

describe('Choice controls', () => {
  it('Checkbox toggles with label click and supports indeterminate', async () => {
    const onChange = vi.fn();
    const { rerender } = renderUI(<Checkbox label="Accept terms" onCheckedChange={onChange} />);
    await userEvent.click(screen.getByText('Accept terms'));
    expect(onChange).toHaveBeenCalledWith(true);
    rerender(<Checkbox label="All" checked="indeterminate" />);
    expect(screen.getByRole('checkbox', { name: 'All' })).toHaveAttribute('aria-checked', 'mixed');
  });

  it('RadioGroup moves with arrow keys', async () => {
    renderUI(
      <RadioGroup label="Plan" defaultValue="free">
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument();
    screen.getByRole('radio', { name: 'Free' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    // Radix checks the focused radio on arrow keys in real browsers; jsdom only moves focus.
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveFocus();
  });

  it('Switch toggles', async () => {
    renderUI(<Switch label="Wi-Fi" />);
    const sw = screen.getByRole('switch', { name: 'Wi-Fi' });
    await userEvent.click(sw);
    expect(sw).toBeChecked();
  });
});

describe('Select', () => {
  it('opens, picks an option and shows it', async () => {
    const onValueChange = vi.fn();
    renderUI(
      <Select label="Country" onValueChange={onValueChange}>
        <Select.Item value="my">Malaysia</Select.Item>
        <Select.Item value="sg">Singapore</Select.Item>
      </Select>,
    );
    const trigger = screen.getByRole('combobox', { name: /Country/ });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('option', { name: 'Singapore' }));
    expect(onValueChange).toHaveBeenCalledWith('sg');
    expect(trigger).toHaveTextContent('Singapore');
  });
});

describe('Combobox', () => {
  const options = [
    { value: 'kl', label: 'Kuala Lumpur' },
    { value: 'pg', label: 'Penang' },
    { value: 'jb', label: 'Johor Bahru', disabled: true },
  ];

  it('filters as you type and selects with Enter', async () => {
    const onValueChange = vi.fn();
    renderUI(<Combobox label="City" options={options} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'City' });
    await userEvent.type(input, 'pen');
    const listbox = await screen.findByRole('listbox');
    expect(within(listbox).getAllByRole('option')).toHaveLength(1);
    await userEvent.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('pg');
    expect(input).toHaveValue('Penang');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('skips disabled options with arrow keys', async () => {
    renderUI(<Combobox label="City" options={options} />);
    const input = screen.getByRole('combobox', { name: 'City' });
    input.focus();
    const activeText = () => document.getElementById(input.getAttribute('aria-activedescendant')!)?.textContent;
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}'); // open, Kuala Lumpur, Penang
    expect(activeText()).toBe('Penang');
    await userEvent.keyboard('{ArrowDown}'); // Johor Bahru is disabled, so it wraps to Kuala Lumpur
    expect(activeText()).toBe('Kuala Lumpur');
  });
});

describe('NumberField', () => {
  it('steps with arrow keys and respects max', async () => {
    const onValueChange = vi.fn();
    renderUI(<NumberField label="Seats" defaultValue={9} max={10} onValueChange={onValueChange} />);
    const input = screen.getByRole('spinbutton', { name: 'Seats' });
    input.focus();
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expect(onValueChange).toHaveBeenLastCalledWith(10);
    expect(input).toHaveAttribute('aria-valuenow', '10');
  });
});

describe('DatePicker and Calendar', () => {
  it('moves focus with arrow keys and selects a date', async () => {
    const onSelect = vi.fn();
    renderUI(<Calendar value={new Date(2026, 10, 23)} onSelect={onSelect} locale="en-GB" weekStartsOn={1} />);
    screen.getByRole('button', { name: /23 November 2026/ }).focus();
    await userEvent.keyboard('{ArrowRight}{Enter}');
    expect(onSelect).toHaveBeenCalledWith(new Date(2026, 10, 24));
  });

  it('opens a dialog from the trigger', async () => {
    renderUI(<DatePicker label="Start date" locale="en-GB" />);
    await userEvent.click(screen.getByRole('button', { name: /Start date/ }));
    expect(await screen.findByRole('dialog', { name: 'Choose date' })).toBeInTheDocument();
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });
});

describe('Dialog', () => {
  it('opens, traps focus, closes with Escape and returns focus', async () => {
    renderUI(
      <Dialog>
        <Dialog.Trigger asChild>
          <Button>Edit</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Edit profile</Dialog.Title>
          <Dialog.Description>Change your name</Dialog.Description>
          <TextField label="Name" />
        </Dialog.Content>
      </Dialog>,
    );
    const trigger = screen.getByRole('button', { name: 'Edit' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Edit profile' });
    expect(dialog).toHaveAccessibleDescription('Change your name');
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('AlertDialog focuses Cancel first and awaits onConfirm', async () => {
    const onConfirm = vi.fn(() => Promise.resolve());
    renderUI(<AlertDialog trigger={<Button>Delete</Button>} title="Delete project?" confirmLabel="Delete" onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    const dialog = await screen.findByRole('alertdialog', { name: 'Delete project?' });
    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });
});

describe('DropdownMenu', () => {
  it('opens with keyboard and runs an item', async () => {
    const onSelect = vi.fn();
    renderUI(
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button>Actions</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onSelect={onSelect}>Rename</DropdownMenu.Item>
          <DropdownMenu.Item tone="danger">Delete</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>,
    );
    screen.getByRole('button', { name: 'Actions' }).focus();
    await userEvent.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Rename' }));
    expect(onSelect).toHaveBeenCalled();
  });
});

describe('Toast', () => {
  it('announces, then dismisses after its duration', async () => {
    vi.useFakeTimers();
    renderUI(<Toaster />);
    act(() => {
      toast({ title: 'Saved', duration: 1000 });
    });
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
    act(() => vi.advanceTimersByTime(1100));
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('danger toasts use role=alert and persist', () => {
    renderUI(<Toaster />);
    act(() => {
      toast.error('Upload failed');
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Upload failed');
    act(() => toast.dismiss());
  });
});

describe('Table', () => {
  type Row = { id: string; name: string; seats: number };
  const data: Row[] = [
    { id: '1', name: 'Acme', seats: 12 },
    { id: '2', name: 'Globex', seats: 4 },
  ];
  const columns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'seats', header: 'Seats', align: 'end' as const },
  ];

  it('cycles sort and reports aria-sort', async () => {
    const onSortChange = vi.fn();
    renderUI(<Table caption="Customers" columns={columns} data={data} rowKey={(r) => r.id} sort={{ key: 'name', direction: 'asc' }} onSortChange={onSortChange} />);
    expect(screen.getByRole('table', { name: 'Customers' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.click(screen.getByRole('button', { name: /Name/ }));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'desc' });
  });

  it('selects all rows and labels each checkbox', async () => {
    const onSelectionChange = vi.fn();
    renderUI(
      <Table caption="Customers" columns={columns} data={data} rowKey={(r) => r.id} rowLabel={(r) => r.name} selection={new Set(['1'])} onSelectionChange={onSelectionChange} />,
    );
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toHaveAttribute('aria-checked', 'mixed');
    expect(screen.getByRole('checkbox', { name: 'Select Acme' })).toBeChecked();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onSelectionChange.mock.calls[0]![0]).toEqual(new Set(['1', '2']));
  });

  it('shows the empty state', () => {
    renderUI(<Table caption="Customers" columns={columns} data={[]} rowKey={(r: Row) => r.id} emptyState={<EmptyState title="No customers yet" />} />);
    expect(screen.getByText('No customers yet')).toBeInTheDocument();
  });
});

describe('Navigation', () => {
  it('Tabs switch panels with arrow keys', async () => {
    renderUI(
      <Tabs defaultValue="a">
        <Tabs.List aria-label="Settings">
          <Tabs.Trigger value="a">General</Tabs.Trigger>
          <Tabs.Trigger value="b">Billing</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">General panel</Tabs.Content>
        <Tabs.Content value="b">Billing panel</Tabs.Content>
      </Tabs>,
    );
    screen.getByRole('tab', { name: 'General' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Billing panel');
  });

  it('Breadcrumbs mark the current page', () => {
    renderUI(<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Settings' }]} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByText('Settings')).toHaveAttribute('aria-current', 'page');
  });

  it('Pagination ranges collapse with gaps', () => {
    expect(getPageRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageRange(1, 20)).toEqual([1, 2, 3, 4, 5, 'gap', 20]);
    expect(getPageRange(10, 20)).toEqual([1, 'gap', 9, 10, 11, 'gap', 20]);
    expect(getPageRange(20, 20)).toEqual([1, 'gap', 16, 17, 18, 19, 20]);
  });

  it('Pagination marks the current page and disables Previous on page 1', async () => {
    const onPageChange = vi.fn();
    renderUI(<Pagination page={1} pageCount={10} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});

describe('Theming', () => {
  it('createTheme generates brand palette and overrides', () => {
    const theme = createTheme({ brand: '#7c3aed', tokens: { radius: { md: '6px' } }, colors: { dark: { bg: '#000000' } } });
    expect(Object.keys(theme.vars).filter((k) => k.startsWith('--ui-brand-'))).toHaveLength(11);
    expect(theme.vars['--ui-radius-md']).toBe('6px');
    expect(theme.schemes.dark['--ui-color-bg']).toBe('#000000');
  });

  it('portals overlays inside the theme root so they inherit tokens', async () => {
    const { container } = renderUI(
      <Dialog defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Hi</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    );
    const dialog = await screen.findByRole('dialog');
    expect(container.querySelector('.ui-theme')).toContainElement(dialog);
  });
});

describe('Accessibility (axe)', () => {
  it('has no violations across a kitchen-sink page', async () => {
    const { container } = renderUI(
      <Stack gap={4}>
        <Heading level={1}>Settings</Heading>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Settings' }]} />
        <Alert tone="warning" title="Trial ends soon" onDismiss={() => {}}>Upgrade to keep your data.</Alert>
        <TextField label="Name" hint="As on your ID" required />
        <TextField label="Email" error="Enter a valid email" />
        <Textarea label="Bio" showCount maxLength={200} />
        <NumberField label="Seats" defaultValue={3} min={1} />
        <Select label="Plan" defaultValue="pro">
          <Select.Item value="free">Free</Select.Item>
          <Select.Item value="pro">Pro</Select.Item>
        </Select>
        <Combobox label="City" options={[{ value: 'kl', label: 'Kuala Lumpur' }]} />
        <DatePicker label="Start date" />
        <Checkbox label="Email me updates" description="About once a month" />
        <RadioGroup label="Billing" defaultValue="m">
          <Radio value="m" label="Monthly" />
          <Radio value="y" label="Yearly" />
        </RadioGroup>
        <Switch label="Dark mode" />
        <Slider label="Volume" defaultValue={[40]} />
        <Field label="Custom">{(ctx) => <input id={ctx.id} />}</Field>
        <Progress label="Upload" value={40} showValue />
        <Spinner />
        <Card>
          <Card.Header>
            <Card.Title level={2}>Team</Card.Title>
            <Card.Description>3 members</Card.Description>
          </Card.Header>
          <Stack direction="row">
            <Avatar name="Aisha Rahman" />
            <Badge tone="success">Active</Badge>
            <Tag onRemove={() => {}}>Design</Tag>
          </Stack>
        </Card>
        <Accordion type="single" collapsible>
          <Accordion.Item value="a" title="What is included?">Everything.</Accordion.Item>
        </Accordion>
        <Tabs defaultValue="a">
          <Tabs.List aria-label="Sections">
            <Tabs.Trigger value="a">One</Tabs.Trigger>
            <Tabs.Trigger value="b">Two</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="a">First</Tabs.Content>
          <Tabs.Content value="b">Second</Tabs.Content>
        </Tabs>
        <Table caption="Customers" columns={[{ key: 'name', header: 'Name', sortable: true }]} data={[{ id: '1', name: 'Acme' }]} rowKey={(r) => r.id} selection={new Set()} onSelectionChange={() => {}} />
        <Pagination page={2} pageCount={8} onPageChange={() => {}} />
        <Tooltip content="More info">
          <Button>Help</Button>
        </Tooltip>
        <EmptyState title="Nothing yet" />
      </Stack>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });

  it('open Dialog has no violations', async () => {
    renderUI(
      <Dialog defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Invite</Dialog.Title>
          <Dialog.Description>Send an invite link</Dialog.Description>
          <TextField label="Email" />
        </Dialog.Content>
      </Dialog>,
    );
    await screen.findByRole('dialog');
    expect(await axeViolations(document.body)).toEqual([]);
  });
});
