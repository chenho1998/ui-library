import * as React from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  Accordion, Alert, Avatar, Box, Button, ButtonGroup, Combobox, Container, Divider, Drawer, Grid, Heading, Link, Popover,
  Progress, Slider, Stack, Tag, ThemeProvider, Toaster, Tooltip, VisuallyHidden, getThemeScript, toast, useTheme,
  type ComboboxOption,
} from '../src';
import { axeViolations, renderUI } from './utils';

const cities: ComboboxOption[] = [
  { value: 'kl', label: 'Kuala Lumpur' },
  { value: 'pg', label: 'Penang' },
  { value: 'jb', label: 'Johor Bahru', disabled: true },
  { value: 'ip', label: 'Ipoh' },
];

describe('Combobox (multiple)', () => {
  it('picks several values, keeps the list open, and removes with Backspace or the tag button', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderUI(<Combobox multiple label="Cities" options={cities} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Cities' });

    await user.type(input, 'kual');
    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith(['kl']);
    expect(input).toHaveValue('');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');

    await user.type(input, 'pen');
    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith(['kl', 'pg']);
    expect(screen.getByRole('button', { name: 'Remove Penang' })).toBeInTheDocument();

    await user.keyboard('{Backspace}');
    expect(onValueChange).toHaveBeenLastCalledWith(['kl']);
    expect(screen.queryByRole('button', { name: 'Remove Penang' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove Kuala Lumpur' }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
    expect(input).toHaveFocus();
  });

  it('toggles an option off when chosen again and marks selected options', async () => {
    const user = userEvent.setup();
    renderUI(<Combobox multiple label="Cities" options={cities} />);
    await user.click(screen.getByRole('combobox', { name: 'Cities' }));
    const ipoh = screen.getByRole('option', { name: 'Ipoh' });
    await user.click(ipoh);
    expect(ipoh).toHaveAttribute('aria-selected', 'true');
    await user.click(ipoh);
    expect(ipoh).toHaveAttribute('aria-selected', 'false');
  });

  it('submits one form value per selection and only requires the text box when empty', () => {
    const { container, rerender } = renderUI(
      <form>
        <Combobox multiple required name="cities" label="Cities" options={cities} defaultValue={['kl', 'pg']} />
      </form>,
    );
    expect(new FormData(container.querySelector('form')!).getAll('cities')).toEqual(['kl', 'pg']);
    const input = screen.getByRole('combobox', { name: /Cities/ });
    expect(input).not.toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-required', 'true');

    rerender(
      <ThemeProvider defaultColorScheme="light">
        <form>
          <Combobox multiple required name="cities" label="Cities" options={cities} value={[]} />
        </form>
      </ThemeProvider>,
    );
    expect(screen.getByRole('combobox', { name: /Cities/ })).toHaveAttribute('required');
  });
});

describe('Combobox (async)', () => {
  // A pretend server that answers the latest query only when the test calls respond().
  let respond = () => {};
  function ServerCombobox() {
    const [options, setOptions] = React.useState<ComboboxOption[]>([]);
    const [loading, setLoading] = React.useState(false);
    return (
      <Combobox
        label="City"
        options={options}
        loading={loading}
        filter={false}
        onInputChange={(q) => {
          setLoading(true);
          respond = () =>
            act(() => {
              setOptions(cities.filter((c) => c.label.toLowerCase().includes(q.toLowerCase())));
              setLoading(false);
            });
        }}
      />
    );
  }

  it('shows a busy list while loading, then announces the result count', async () => {
    const user = userEvent.setup();
    renderUI(<ServerCombobox />);
    await user.type(screen.getByRole('combobox', { name: 'City' }), 'pe');

    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('aria-busy', 'true');
    expect(within(listbox).getByText('Loading')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Loading');

    respond();
    expect(within(listbox).getByRole('option', { name: 'Penang' })).toBeInTheDocument();
    expect(listbox).not.toHaveAttribute('aria-busy');
    expect(screen.getByRole('status')).toHaveTextContent('1 result');
  });

  it('keeps showing the chosen label after the server results change', async () => {
    const user = userEvent.setup();
    renderUI(<ServerCombobox />);
    const input = screen.getByRole('combobox', { name: 'City' });
    await user.type(input, 'pen');
    respond();
    await user.keyboard('{Enter}');
    expect(input).toHaveValue('Penang');

    await user.type(input, '{Control>}a{/Control}ku');
    respond();
    expect(screen.getByRole('option', { name: 'Kuala Lumpur' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Penang' })).not.toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(input).toHaveValue('Penang');
  });
});

describe('Toast swipe', () => {
  const swipe = (el: Element, xs: number[]) => {
    fireEvent.pointerDown(el, { clientX: xs[0], clientY: 10, button: 0, pointerId: 1 });
    for (const x of xs.slice(1)) fireEvent.pointerMove(el, { clientX: x, clientY: 10, pointerId: 1 });
    fireEvent.pointerUp(el, { clientX: xs[xs.length - 1], clientY: 10, pointerId: 1 });
  };

  afterEach(() => act(() => toast.dismiss()));

  it('snaps back after a short drag or a drag towards the wrong edge', () => {
    renderUI(<Toaster position="bottom-right" />);
    act(() => {
      toast({ title: 'Swipe me', duration: Infinity });
    });
    const el = screen.getByRole('status');

    fireEvent.pointerDown(el, { clientX: 200, clientY: 10, button: 0, pointerId: 1 });
    fireEvent.pointerMove(el, { clientX: 150, clientY: 10, pointerId: 1 });
    fireEvent.pointerMove(el, { clientX: 100, clientY: 10, pointerId: 1 });
    expect(el.style.transform).toBe('translateX(-16px)'); // resisted
    fireEvent.pointerUp(el, { clientX: 100, clientY: 10, pointerId: 1 });
    expect(el.style.transform).toBe('');

    swipe(el, [200, 207, 210]);
    expect(el).toBeInTheDocument();
    expect(el.style.transform).toBe('');
  });

  it('slides out and dismisses after a long drag towards its edge', async () => {
    renderUI(<Toaster position="bottom-right" />);
    act(() => {
      toast({ title: 'Swipe me', duration: Infinity });
    });
    const el = screen.getByRole('status');
    swipe(el, [200, 220, 320]);
    expect(el.style.transform).toBe('translateX(110%)');
    await waitFor(() => expect(screen.queryByText('Swipe me')).not.toBeInTheDocument());
  });

  it('ignores drags that start on its buttons', () => {
    renderUI(<Toaster />);
    act(() => {
      toast({ title: 'Swipe me', duration: Infinity });
    });
    const close = screen.getByRole('button', { name: 'Dismiss' });
    fireEvent.pointerDown(close, { clientX: 200, clientY: 10, button: 0, pointerId: 1 });
    fireEvent.pointerMove(close, { clientX: 300, clientY: 10, pointerId: 1 });
    fireEvent.pointerMove(close, { clientX: 400, clientY: 10, pointerId: 1 });
    expect(screen.getByRole('status').style.transform).toBe('');
  });
});

describe('Slider', () => {
  it('changes with arrow keys and announces the formatted value', async () => {
    const user = userEvent.setup();
    renderUI(<Slider label="Volume" defaultValue={[40]} step={10} showValue formatValue={(v) => `${v}%`} />);
    const thumb = screen.getByRole('slider', { name: 'Volume' });
    expect(thumb).toHaveAttribute('aria-valuetext', '40%');
    act(() => thumb.focus());
    await user.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '50');
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('names each thumb of a range', () => {
    renderUI(<Slider label="Price" defaultValue={[20, 80]} thumbLabels={['Minimum price', 'Maximum price']} />);
    expect(screen.getByRole('slider', { name: 'Minimum price' })).toHaveAttribute('aria-valuenow', '20');
    expect(screen.getByRole('slider', { name: 'Maximum price' })).toHaveAttribute('aria-valuenow', '80');
  });
});

describe('Popover, Tooltip and Drawer', () => {
  it('Popover opens from its trigger and returns focus on Escape', async () => {
    const user = userEvent.setup();
    renderUI(
      <Popover>
        <Popover.Trigger asChild>
          <Button>Filters</Button>
        </Popover.Trigger>
        <Popover.Content aria-label="Filter options">
          <Button>Apply</Button>
        </Popover.Content>
      </Popover>,
    );
    const trigger = screen.getByRole('button', { name: 'Filters' });
    await user.click(trigger);
    expect(await screen.findByRole('dialog', { name: 'Filter options' })).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('Tooltip shows on keyboard focus and describes its trigger', async () => {
    const user = userEvent.setup();
    renderUI(
      <Tooltip content="More actions" delay={0}>
        <Button aria-label="Menu">…</Button>
      </Tooltip>,
    );
    await user.tab();
    const tip = await screen.findByRole('tooltip');
    expect(tip).toHaveTextContent('More actions');
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-describedby', tip.id);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('Drawer is a labelled modal dialog on the chosen side and closes with Escape', async () => {
    const user = userEvent.setup();
    renderUI(
      <Drawer>
        <Drawer.Trigger asChild>
          <Button>Open filters</Button>
        </Drawer.Trigger>
        <Drawer.Content side="left">
          <Drawer.Title>Filters</Drawer.Title>
          <Drawer.Description>Narrow down the list.</Drawer.Description>
        </Drawer.Content>
      </Drawer>,
    );
    await user.click(screen.getByRole('button', { name: 'Open filters' }));
    const drawer = await screen.findByRole('dialog', { name: 'Filters' });
    expect(drawer).toHaveAttribute('data-side', 'left');
    expect(drawer).toHaveAccessibleDescription('Narrow down the list.');
    expect(await axeViolations(document.body)).toEqual([]);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Open filters' })).toHaveFocus();
  });
});

describe('Feedback and data display', () => {
  it('Alert only interrupts when live, and has a labelled dismiss button', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { rerender } = renderUI(<Alert title="Heads up">Body</Alert>);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    rerender(
      <ThemeProvider defaultColorScheme="light">
        <Alert title="Saved" tone="success" live onDismiss={onDismiss}>
          Body
        </Alert>
      </ThemeProvider>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Saved');
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('Progress exposes its value and label; indeterminate has no value', () => {
    renderUI(
      <>
        <Progress label="Uploading" value={35} showValue />
        <Progress aria-label="Working" value={null} />
      </>,
    );
    expect(screen.getByRole('progressbar', { name: 'Uploading' })).toHaveAttribute('aria-valuenow', '35');
    expect(screen.getByText('35%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Working' })).not.toHaveAttribute('aria-valuenow');
  });

  it('Avatar falls back to initials with the full name for screen readers', async () => {
    renderUI(<Avatar name="Aisha binti Rahman" />);
    expect(await screen.findByText('AB')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Aisha binti Rahman')).toHaveClass('ui-visually-hidden');
  });

  it('Tag remove button uses the locale label', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    renderUI(
      <>
        <Tag onRemove={onRemove}>React</Tag>
        <ThemeProvider locale={{ removeItem: (label) => `Buang ${label}` }}>
          <Tag onRemove={() => {}}>Vue</Tag>
        </ThemeProvider>
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Remove React' }));
    expect(onRemove).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Buang Vue' })).toBeInTheDocument();
  });

  it('Accordion uses real headings and moves between headers with arrow keys', async () => {
    const user = userEvent.setup();
    renderUI(
      <Accordion type="single" collapsible>
        <Accordion.Item value="a" title="Can I change plans?" headingLevel={2}>
          Yes.
        </Accordion.Item>
        <Accordion.Item value="b" title="Do you offer refunds?" headingLevel={2}>
          Within 30 days.
        </Accordion.Item>
      </Accordion>,
    );
    const first = screen.getByRole('button', { name: 'Can I change plans?' });
    expect(screen.getAllByRole('heading', { level: 2 })[0]).toContainElement(first);
    expect(first).toHaveAttribute('aria-expanded', 'false');
    await user.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'Can I change plans?' })).toHaveTextContent('Yes.');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Do you offer refunds?' })).toHaveFocus();
  });
});

describe('Actions and layout', () => {
  it('ButtonGroup is a named group', () => {
    renderUI(
      <ButtonGroup aria-label="Alignment" attached>
        <Button>Left</Button>
        <Button>Right</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group', { name: 'Alignment' })).toHaveAttribute('data-attached', 'true');
  });

  it('Link opens external pages safely and says so; asChild keeps the child element', () => {
    renderUI(
      <>
        <Link href="https://example.com" external>
          Docs
        </Link>
        <Link asChild>
          <a href="/home">Home</a>
        </Link>
      </>,
    );
    const docs = screen.getByRole('link', { name: /^Docs\s*\(opens in a new tab\)$/ });
    expect(docs).toHaveAttribute('target', '_blank');
    expect(docs).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveClass('ui-link');
  });

  it('layout primitives map props to token-based styles', () => {
    renderUI(
      <>
        <Box data-testid="box" p={4} px={2} />
        <Stack data-testid="stack" direction="row" gap={2} align="center" />
        <Grid data-testid="grid" columns={3} gap={6} />
        <Container data-testid="container" size="sm" />
        <Heading level={1}>Title</Heading>
        <Heading level={3} size="sm">
          Small
        </Heading>
        <Divider data-testid="divider" />
        <Divider orientation="vertical" decorative={false} />
        <VisuallyHidden>Hidden note</VisuallyHidden>
      </>,
    );
    const box = screen.getByTestId('box');
    expect(box.style.padding).toBe('var(--ui-space-4)');
    expect(box.style.paddingInline).toBe('var(--ui-space-2)');
    const stack = screen.getByTestId('stack');
    expect(stack.style.flexDirection).toBe('row');
    expect(stack.style.alignItems).toBe('center');
    expect(screen.getByTestId('grid').style.gridTemplateColumns).toMatch(/^repeat\(3, minmax\(0(px)?, 1fr\)\)$/);
    expect(screen.getByTestId('container')).toHaveAttribute('data-size', 'sm');
    expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute('data-size', '3xl');
    expect(screen.getByRole('heading', { level: 3 })).toHaveAttribute('data-size', 'sm');
    expect(screen.getByTestId('divider')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
    expect(screen.getByText('Hidden note')).toHaveClass('ui-visually-hidden');
  });
});

describe('Saved colour scheme', () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  function SchemeButton() {
    const { resolvedColorScheme, setColorScheme } = useTheme();
    return <button onClick={() => setColorScheme('dark')}>{resolvedColorScheme}</button>;
  }

  it('remembers the chosen scheme under storageKey', async () => {
    const user = userEvent.setup();
    const first = render(
      <ThemeProvider storageKey="test-scheme" defaultColorScheme="light">
        <SchemeButton />
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'light' }));
    expect(localStorage.getItem('test-scheme')).toBe('dark');
    expect(first.container.querySelector('.ui-theme')).toHaveAttribute('data-theme', 'dark');
    first.unmount();

    render(
      <ThemeProvider storageKey="test-scheme" defaultColorScheme="light">
        <SchemeButton />
      </ThemeProvider>,
    );
    expect(screen.getByRole('button', { name: 'dark' })).toBeInTheDocument();
  });

  it('getThemeScript applies the saved scheme, or the fallback, before React loads', () => {
    new Function(getThemeScript('test-scheme', 'light'))();
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    localStorage.setItem('test-scheme', 'dark');
    new Function(getThemeScript('test-scheme', 'light'))();
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });
});
