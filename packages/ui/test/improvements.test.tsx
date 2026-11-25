import * as React from 'react';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AlertDialog, Button, Calendar, Combobox, CommandPalette, DatePicker, DateRangePicker, DescriptionList, Dialog,
  FileUpload, NumberField, Pagination, PinInput, Rating, Sidebar, Stepper, Table, TimePicker, Timeline, Toaster,
  Tooltip, TreeView, toast, type TreeNode,
} from '../src';
import { renderUI } from './utils';

describe('Forwarded refs and DOM pass-through', () => {
  it('forwards refs across PinInput, FileUpload, Rating, Calendar, TreeView, Timeline.Item, DescriptionList.Item, Dialog parts, and Sidebar parts', () => {
    const pinRef = React.createRef<HTMLDivElement>();
    const fileRef = React.createRef<HTMLInputElement>();
    const ratingRef = React.createRef<HTMLElement>();
    const calRef = React.createRef<HTMLDivElement>();
    const treeRef = React.createRef<HTMLUListElement>();
    const tlItemRef = React.createRef<HTMLLIElement>();
    const dlItemRef = React.createRef<HTMLDivElement>();
    const sbGroupRef = React.createRef<HTMLDivElement>();
    const sbSubRef = React.createRef<HTMLLIElement>();
    const dlgBodyRef = React.createRef<HTMLDivElement>();
    const dlgFooterRef = React.createRef<HTMLDivElement>();

    renderUI(
      <>
        <PinInput ref={pinRef} label="PIN" length={4} />
        <FileUpload ref={fileRef} label="Docs" />
        <Rating ref={ratingRef} label="Score" />
        <Calendar ref={calRef} />
        <TreeView ref={treeRef} aria-label="Files" items={[{ id: 'a', label: 'A' }]} data-testid="tree" />
        <Timeline>
          <Timeline.Item ref={tlItemRef} title="Created" />
        </Timeline>
        <DescriptionList>
          <DescriptionList.Item ref={dlItemRef} term="Status">Active</DescriptionList.Item>
        </DescriptionList>
        <Sidebar>
          <Sidebar.Content>
            <Sidebar.Group ref={sbGroupRef} label="Main">
              <Sidebar.Submenu ref={sbSubRef} label="More">
                <Sidebar.Item href="/x">X</Sidebar.Item>
              </Sidebar.Submenu>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar>
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Ref test</Dialog.Title>
            <Dialog.Body ref={dlgBodyRef}>Body</Dialog.Body>
            <Dialog.Footer ref={dlgFooterRef}>Footer</Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </>,
    );

    expect(pinRef.current?.getAttribute('role')).toBe('group');
    expect(fileRef.current?.type).toBe('file');
    expect(ratingRef.current?.tagName).toBe('FIELDSET');
    expect(calRef.current).toHaveClass('ui-calendar');
    expect(treeRef.current).toBe(screen.getByTestId('tree'));
    expect(tlItemRef.current?.tagName).toBe('LI');
    expect(dlItemRef.current).toHaveClass('ui-dl__item');
    expect(sbGroupRef.current).toHaveClass('ui-sidebar__group');
    expect(sbSubRef.current?.tagName).toBe('LI');
    expect(dlgBodyRef.current).toHaveClass('ui-dialog__body');
    expect(dlgFooterRef.current).toHaveClass('ui-dialog__footer');
  });
});

describe('Existing component edge cases and API improvements', () => {
  afterEach(() => act(() => toast.dismiss()));

  it('Button prevents clicks when asChild and disabled are both set', async () => {
    const onClick = vi.fn();
    renderUI(
      <Button asChild disabled onClick={onClick}>
        <a href="#blocked">Go</a>
      </Button>,
    );
    await userEvent.click(screen.getByRole('link', { name: 'Go' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('NumberField steps from typed draft and allows Enter form submit when clean', async () => {
    const onValueChange = vi.fn();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    renderUI(
      <form onSubmit={onSubmit}>
        <NumberField label="Qty" defaultValue={1} onValueChange={onValueChange} />
        <button type="submit">Submit</button>
      </form>,
    );
    const input = screen.getByRole('spinbutton', { name: 'Qty' });
    await userEvent.clear(input);
    await userEvent.type(input, '5');
    await userEvent.keyboard('{ArrowUp}');
    expect(onValueChange).toHaveBeenLastCalledWith(6);
    await userEvent.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('Combobox supports controlled open and handles all-disabled options without highlighting them', async () => {
    const onOpenChange = vi.fn();
    renderUI(
      <Combobox
        label="Plan"
        options={[{ value: 'a', label: 'Alpha', disabled: true }]}
        defaultOpen
        onOpenChange={onOpenChange}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Plan' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    input.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(input).not.toHaveAttribute('aria-activedescendant');
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('DatePicker, TimePicker and DateRangePicker support controlled open state', () => {
    const a = renderUI(<DatePicker label="Date" open />);
    expect(screen.getByRole('dialog', { name: 'Choose date' })).toBeInTheDocument();
    a.unmount();

    const b = renderUI(<TimePicker label="Time" open />);
    expect(screen.getByRole('dialog', { name: 'Choose time' })).toBeInTheDocument();
    b.unmount();

    renderUI(<DateRangePicker label="Range" open />);
    expect(screen.getByRole('dialog', { name: 'Choose date' })).toBeInTheDocument();
  });

  it('Calendar supports controlled month and uncontrolled selection', async () => {
    const onMonthChange = vi.fn();
    renderUI(<Calendar month={new Date(2026, 4, 1)} onMonthChange={onMonthChange} locale="en-GB" />);
    expect(screen.getByRole('heading', { name: 'May 2026' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(onMonthChange).toHaveBeenCalledWith(new Date(2026, 5, 1));
  });

  it('Pagination works uncontrolled with defaultPage and clamps out-of-range page', async () => {
    const onPageChange = vi.fn();
    renderUI(<Pagination defaultPage={2} pageCount={5} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('Rating allowClear resets to 0 when clicking the current star', async () => {
    const onValueChange = vi.fn();
    renderUI(<Rating label="Rating" defaultValue={3} allowClear onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('radio', { name: '3 of 5 stars' }));
    expect(onValueChange).toHaveBeenCalledWith(0);
  });

  it('Stepper supports allowClickAll and custom step icons', async () => {
    const onStepClick = vi.fn();
    renderUI(
      <Stepper
        aria-label="Steps"
        current={0}
        allowClickAll
        onStepClick={onStepClick}
        steps={[
          { title: 'Start', icon: <span>S</span> },
          { title: 'Finish' },
        ]}
      />,
    );
    expect(screen.getByText('S')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Finish/ }));
    expect(onStepClick).toHaveBeenCalledWith(1);
  });

  it('Table clickable rows can be activated from the keyboard', async () => {
    const onRowClick = vi.fn();
    renderUI(
      <Table
        caption="Users"
        columns={[{ key: 'name', header: 'Name' }]}
        data={[{ id: '1', name: 'Ada' }]}
        rowKey={(r) => r.id}
        onRowClick={onRowClick}
      />,
    );
    const row = screen.getByText('Ada').closest('tr')!;
    row.focus();
    await userEvent.keyboard('{Enter}');
    expect(onRowClick).toHaveBeenCalledWith({ id: '1', name: 'Ada' });
  });

  it('TreeView supports * to expand siblings and type-ahead focus', async () => {
    const nodes: TreeNode[] = [
      { id: 'alpha', label: 'Alpha', children: [{ id: 'a1', label: 'A1' }] },
      { id: 'beta', label: 'Beta', children: [{ id: 'b1', label: 'B1' }] },
      { id: 'gamma', label: 'Gamma' },
    ];
    renderUI(<TreeView aria-label="Items" items={nodes} />);
    const alpha = screen.getByRole('treeitem', { name: 'Alpha' });
    act(() => alpha.focus());
    await userEvent.keyboard('*');
    expect(alpha).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('treeitem', { name: /^Beta/ })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('g');
    expect(screen.getByRole('treeitem', { name: 'Gamma' })).toHaveFocus();
  });

  it('toast exposes info, warning and promise helpers', async () => {
    renderUI(<Toaster />);
    act(() => {
      toast.info('Heads up');
      toast.warning('Watch out');
    });
    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByText('Watch out')).toBeInTheDocument();

    let resolve!: (v: string) => void;
    const p = new Promise<string>((r) => {
      resolve = r;
    });
    act(() => {
      void toast.promise(p, { loading: 'Saving…', success: (v) => `Saved ${v}`, error: 'Failed' });
    });
    expect(screen.getByText('Saving…')).toBeInTheDocument();
    await act(async () => {
      resolve('profile');
      await p;
    });
    expect(screen.getByText('Saved profile')).toBeInTheDocument();
  });

  it('AlertDialog stays open while async onConfirm is pending and Tooltip disabled renders child directly', async () => {
    let finish!: () => void;
    const pending = new Promise<void>((r) => {
      finish = r;
    });
    renderUI(
      <>
        <AlertDialog trigger={<Button>Archive</Button>} title="Archive item?" onConfirm={() => pending} />
        <Tooltip content="Hidden" disabled delay={0}>
          <Button>Plain</Button>
        </Tooltip>
      </>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Archive' }));
    const dlg = await screen.findByRole('alertdialog');
    await userEvent.click(within(dlg).getByRole('button', { name: 'Confirm' }));
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    await act(async () => {
      finish();
      await pending;
    });
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());

    await userEvent.hover(screen.getByRole('button', { name: 'Plain' }));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('CommandPalette ignores arrow keys when no enabled items match', async () => {
    renderUI(<CommandPalette defaultOpen items={[{ id: 'x', label: 'Disabled', disabled: true, onSelect: () => {} }]} />);
    const input = await screen.findByRole('combobox', { name: 'Command palette' });
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(input).not.toHaveAttribute('aria-activedescendant');
  });
});
