import * as React from 'react';
import { act, fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Banner, Button, Carousel, ColorPicker, DataTable, Resizable, type DataTableColumn } from '../src';
import { axeViolations, renderUI } from './utils';

describe('Banner', () => {
  it('renders title, action, live role and dismiss button', async () => {
    const onDismiss = vi.fn();
    renderUI(
      <Banner tone="warning" title="Scheduled maintenance" action={<Button size="sm">Status</Button>} onDismiss={onDismiss} live>
        Sunday 02:00 UTC.
      </Banner>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Scheduled maintenance');
    expect(screen.getByRole('button', { name: 'Status' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('uses role="alert" for live danger banners', () => {
    renderUI(<Banner tone="danger" live>Service degraded</Banner>);
    expect(screen.getByRole('alert')).toHaveTextContent('Service degraded');
  });
});

describe('DataTable', () => {
  type User = { id: string; name: string; role: string; seats: number };
  const users: User[] = [
    { id: '1', name: 'Aisha', role: 'Admin', seats: 12 },
    { id: '2', name: 'Bala', role: 'Editor', seats: 4 },
    { id: '3', name: 'Mei', role: 'Viewer', seats: 25 },
    { id: '4', name: 'Dan', role: 'Editor', seats: 8 },
  ];
  const columns: DataTableColumn<User>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'role', header: 'Role', sortable: true },
    { key: 'seats', header: 'Seats', sortable: true, align: 'end' },
  ];

  it('sorts, filters, paginates and handles bulk selection out of the box', async () => {
    const user = userEvent.setup();
    const onBulk = vi.fn();
    renderUI(
      <DataTable
        caption="Team members"
        columns={columns}
        data={users}
        rowKey={(r) => r.id}
        rowLabel={(r) => r.name}
        searchable
        selectable
        pageSize={2}
        bulkActions={(sel, clear) => (
          <Button size="sm" onClick={() => { onBulk([...sel]); clear(); }}>
            Export
          </Button>
        )}
      />,
    );

    // Page 1 shows first 2 rows
    expect(screen.getByText('Showing 1–2 of 4')).toBeInTheDocument();
    expect(screen.getByText('Aisha')).toBeInTheDocument();
    expect(screen.queryByText('Mei')).not.toBeInTheDocument();

    // Sort by Seats ascending -> Bala (4), Dan (8)
    await user.click(screen.getByRole('button', { name: /Seats/ }));
    const rowsAsc = screen.getAllByRole('row').slice(1);
    expect(rowsAsc[0]).toHaveTextContent('Bala');
    expect(rowsAsc[1]).toHaveTextContent('Dan');

    // Filter by "Editor" -> resets to page 1 and shows Bala + Dan
    const search = screen.getByRole('searchbox');
    await user.type(search, 'editor');
    expect(screen.getByText('Showing 1–2 of 2')).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: 'Select Bala' }));
    expect(screen.getByText('1 selected')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Export' }));
    expect(onBulk).toHaveBeenCalledWith(['2']);
    expect(screen.queryByText('1 selected')).not.toBeInTheDocument();

    // Clear filter restores all 4 rows
    await user.click(screen.getByRole('button', { name: 'Clear filter' }));
    expect(screen.getByText('Showing 1–2 of 4')).toBeInTheDocument();
  });
});

describe('Carousel', () => {
  it('navigates slides via buttons, dots, arrow keys and loop', async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    renderUI(
      <Carousel aria-label="Showcase" loop onIndexChange={onIndexChange}>
        <Carousel.Slide>Slide One</Carousel.Slide>
        <Carousel.Slide>Slide Two</Carousel.Slide>
        <Carousel.Slide>Slide Three</Carousel.Slide>
      </Carousel>,
    );
    const region = screen.getByRole('region', { name: 'Showcase' });
    expect(region).toHaveAttribute('aria-roledescription', 'carousel');
    expect(screen.getByRole('button', { name: 'Slide 1' })).toHaveAttribute('aria-current', 'true');

    await user.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByRole('button', { name: 'Slide 2' })).toHaveAttribute('aria-current', 'true');

    await user.click(screen.getByRole('button', { name: 'Slide 3' }));
    expect(onIndexChange).toHaveBeenLastCalledWith(2);

    // Loop wraps from last slide back to first
    await user.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(onIndexChange).toHaveBeenLastCalledWith(0);

    // Keyboard End jumps to last slide
    screen.getByRole('button', { name: 'Next slide' }).focus();
    await user.keyboard('{End}');
    expect(onIndexChange).toHaveBeenLastCalledWith(2);
  });

  it('autoPlay advances and can be paused', () => {
    vi.useFakeTimers();
    const onIndexChange = vi.fn();
    renderUI(
      <Carousel aria-label="Auto" autoPlay={1000} onIndexChange={onIndexChange}>
        <Carousel.Slide>One</Carousel.Slide>
        <Carousel.Slide>Two</Carousel.Slide>
      </Carousel>,
    );
    act(() => vi.advanceTimersByTime(1050));
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    fireEvent.click(screen.getByRole('button', { name: 'Pause slides' }));
    act(() => vi.advanceTimersByTime(2500));
    expect(onIndexChange).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});

describe('ColorPicker', () => {
  it('opens popover, selects swatches, edits hex and supports keyboard HSV area', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderUI(<ColorPicker label="Brand colour" defaultValue="#2c5df5" onValueChange={onValueChange} />);
    const trigger = screen.getByRole('button', { name: /Brand colour/ });
    expect(trigger).toHaveTextContent('#2C5DF5');

    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Choose colour' });
    await user.click(within(dialog).getByRole('button', { name: '#16A34A' }));
    expect(onValueChange).toHaveBeenLastCalledWith('#16a34a');

    const hexInput = within(dialog).getByRole('textbox', { name: 'Hex colour' });
    await user.clear(hexInput);
    await user.type(hexInput, '#ff0000{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('#ff0000');

    const area = within(dialog).getByRole('slider', { name: 'Saturation and brightness' });
    area.focus();
    await user.keyboard('{ArrowLeft}');
    expect(onValueChange).toHaveBeenCalled();
  });
});

describe('Resizable', () => {
  it('resizes panels via keyboard arrows, Home/End, Enter reset and pointer drag', async () => {
    const user = userEvent.setup();
    const onSizesChange = vi.fn();
    renderUI(
      <Resizable defaultSizes={[40, 60]} onSizesChange={onSizesChange} style={{ width: 500, height: 200 }}>
        <Resizable.Panel minSize={20} maxSize={80}>Left</Resizable.Panel>
        <Resizable.Handle aria-label="Resize sidebar" />
        <Resizable.Panel minSize={20}>Right</Resizable.Panel>
      </Resizable>,
    );
    const handle = screen.getByRole('separator', { name: 'Resize sidebar' });
    expect(handle).toHaveAttribute('aria-orientation', 'vertical');
    expect(handle).toHaveAttribute('aria-valuenow', '40');

    handle.focus();
    await user.keyboard('{ArrowRight}');
    expect(onSizesChange).toHaveBeenLastCalledWith([42, 58]);
    expect(handle).toHaveAttribute('aria-valuenow', '42');

    await user.keyboard('{Home}');
    expect(onSizesChange).toHaveBeenLastCalledWith([20, 80]);

    await user.keyboard('{End}');
    expect(onSizesChange).toHaveBeenLastCalledWith([80, 20]);

    await user.keyboard('{Enter}');
    expect(onSizesChange).toHaveBeenLastCalledWith([40, 60]);
  });
});

describe('Accessibility (axe) of extra components', () => {
  it('has no violations across Banner, DataTable, Carousel, ColorPicker and Resizable', async () => {
    const { container } = renderUI(
      <main>
        <Banner tone="info" title="v0.3" onDismiss={() => {}}>New components available.</Banner>
        <DataTable
          caption="Projects"
          columns={[{ key: 'name', header: 'Name', sortable: true }]}
          data={[{ id: '1', name: 'Apollo' }]}
          rowKey={(r) => r.id}
          searchable
          selectable
          pageSize={5}
        />
        <Carousel aria-label="Slides">
          <Carousel.Slide><p>First</p></Carousel.Slide>
          <Carousel.Slide><p>Second</p></Carousel.Slide>
        </Carousel>
        <ColorPicker label="Accent" />
        <Resizable defaultSizes={[35, 65]}>
          <Resizable.Panel>Navigation</Resizable.Panel>
          <Resizable.Handle aria-label="Resize navigation" />
          <Resizable.Panel>Content</Resizable.Panel>
        </Resizable>
      </main>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
