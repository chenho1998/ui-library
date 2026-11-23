import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cx } from '../utils';
import { useLocale, usePortalContainer } from '../theme/ThemeProvider';
import { SearchIcon } from '../icons';

/* ---------- CommandPalette ---------- */
export interface CommandItem {
  id: string;
  label: string;
  /** Items with the same group are listed together under that heading. */
  group?: string;
  icon?: React.ReactNode;
  /** Shortcut hint shown on the right (display only). */
  shortcut?: string;
  /** Extra words that should match, e.g. synonyms. */
  keywords?: string[];
  disabled?: boolean;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  items: CommandItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Key that opens the palette with Cmd (macOS) or Ctrl. Default `'k'`; `false` for none. */
  hotkey?: string | false;
  placeholder?: string;
  emptyMessage?: React.ReactNode;
  /** Accessible name of the dialog and search box. Default "Command palette". */
  label?: string;
}

const matches = (item: CommandItem, query: string) => {
  const hay = [item.label, item.group ?? '', ...(item.keywords ?? [])].join(' ').toLowerCase();
  return query.toLowerCase().split(/\s+/).filter(Boolean).every((term) => hay.includes(term));
};

/** A searchable list of actions and pages, opened with Cmd+K / Ctrl+K. */
export function CommandPalette({
  items, open: controlled, defaultOpen = false, onOpenChange, hotkey = 'k', placeholder, emptyMessage, label = 'Command palette',
}: CommandPaletteProps) {
  const locale = useLocale();
  const container = usePortalContainer();
  const listId = React.useId();
  const [inner, setInner] = React.useState(defaultOpen);
  const open = controlled ?? inner;
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(0);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (controlled === undefined) setInner(next);
      onOpenChange?.(next);
      if (!next) setQuery('');
    },
    [controlled, onOpenChange],
  );

  React.useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === hotkey.toLowerCase()) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkey, open, setOpen]);

  const visible = items.filter((item) => matches(item, query));
  const enabled = visible.filter((item) => !item.disabled);
  const activeItem = enabled[Math.min(active, enabled.length - 1)];
  const groups = visible.reduce<Array<{ name: string; items: CommandItem[] }>>((acc, item) => {
    const name = item.group ?? '';
    const found = acc.find((g) => g.name === name);
    if (found) found.items.push(item);
    else acc.push({ name, items: [item] });
    return acc;
  }, []);

  React.useEffect(() => {
    if (activeItem) document.getElementById(`${listId}-${activeItem.id}`)?.scrollIntoView({ block: 'nearest' });
  }, [activeItem, listId]);

  const run = (item: CommandItem) => {
    if (item.disabled) return;
    setOpen(false);
    item.onSelect();
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal container={container}>
        <DialogPrimitive.Overlay className="ui-overlay" />
        <DialogPrimitive.Content className="ui-dialog ui-command" aria-describedby={undefined}>
          <DialogPrimitive.Title className="ui-visually-hidden">{label}</DialogPrimitive.Title>
          <div className="ui-command__search">
            <SearchIcon size="sm" />
            <input
              className="ui-command__input"
              role="combobox"
              aria-label={label}
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={activeItem ? `${listId}-${activeItem.id}` : undefined}
              autoComplete="off"
              placeholder={placeholder ?? locale.commandPlaceholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                const last = enabled.length - 1;
                const moves: Record<string, number> = { ArrowDown: active >= last ? 0 : active + 1, ArrowUp: active <= 0 ? last : active - 1, Home: 0, End: last };
                if (e.key in moves) {
                  e.preventDefault();
                  setActive(moves[e.key]!);
                } else if (e.key === 'Enter' && activeItem) {
                  e.preventDefault();
                  run(activeItem);
                }
              }}
            />
          </div>
          <div id={listId} role="listbox" aria-label={label} className="ui-command__list">
            {visible.length === 0 ? (
              <div className="ui-command__empty">{emptyMessage ?? locale.noResults}</div>
            ) : (
              groups.map((group) => (
                <div key={group.name || 'ungrouped'} role="group" aria-label={group.name || undefined}>
                  {group.name ? (
                    <div className="ui-menu-label" aria-hidden="true">
                      {group.name}
                    </div>
                  ) : null}
                  {group.items.map((item) => (
                    // Keyboard selection runs through the search box (aria-activedescendant).
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
                    <div
                      key={item.id}
                      id={`${listId}-${item.id}`}
                      role="option"
                      aria-selected={item === activeItem}
                      aria-disabled={item.disabled || undefined}
                      data-highlighted={item === activeItem ? '' : undefined}
                      data-disabled={item.disabled ? '' : undefined}
                      className="ui-menu-item"
                      onMouseMove={() => !item.disabled && setActive(enabled.indexOf(item))}
                      onClick={() => run(item)}
                    >
                      <span className="ui-menu-item__main">
                        {item.icon ? <span className="ui-menu-item__icon">{item.icon}</span> : null}
                        {item.label}
                      </span>
                      {item.shortcut ? <span className="ui-menu-item__shortcut" aria-hidden="true">{item.shortcut}</span> : null}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/* ---------- HoverCard ---------- */
const HoverCardContent = /* @__PURE__ */ React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>>(
  function HoverCardContent({ className, sideOffset = 8, ...rest }, ref) {
    const container = usePortalContainer();
    return (
      <HoverCardPrimitive.Portal container={container}>
        <HoverCardPrimitive.Content ref={ref} sideOffset={sideOffset} className={cx('ui-popover', 'ui-hover-card', className)} {...rest} />
      </HoverCardPrimitive.Portal>
    );
  },
);

/**
 * A preview shown when pointing at a link (e.g. a profile card on a username). Sighted pointer users only:
 * never put anything there that isn't also reachable another way.
 */
export const HoverCard = /* @__PURE__ */ Object.assign(
  (props: HoverCardPrimitive.HoverCardProps) => <HoverCardPrimitive.Root openDelay={300} closeDelay={150} {...props} />,
  { Trigger: HoverCardPrimitive.Trigger, Content: HoverCardContent },
);

/* ---------- Kbd ---------- */
/** A keyboard key, e.g. `<Kbd>⌘</Kbd><Kbd>K</Kbd>`. */
export const Kbd = /* @__PURE__ */ React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(function Kbd({ className, ...rest }, ref) {
  return <kbd ref={ref} className={cx('ui-kbd', className)} {...rest} />;
});

/* ---------- ScrollArea ---------- */
export interface ScrollAreaProps extends Omit<React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>, 'dir'> {
  /** Which scrollbars to show. Default `'vertical'`. */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Names the scrollable region, so keyboard users know what they are scrolling. */
  'aria-label'?: string;
}

/** A scroll container with slim, themed scrollbars. Keyboard users can focus it and scroll with arrow keys. */
export const ScrollArea = /* @__PURE__ */ React.forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { orientation = 'vertical', className, children, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  return (
    <ScrollAreaPrimitive.Root ref={ref} className={cx('ui-scroll', className)} {...rest}>
      {/* Focusable so keyboard users can scroll it. */}
      { }
      <ScrollAreaPrimitive.Viewport className="ui-scroll__viewport" tabIndex={0} role={ariaLabel ? 'region' : undefined} aria-label={ariaLabel}>
        {children}
      </ScrollAreaPrimitive.Viewport>
      {orientation !== 'horizontal' ? (
        <ScrollAreaPrimitive.Scrollbar orientation="vertical" className="ui-scroll__bar">
          <ScrollAreaPrimitive.Thumb className="ui-scroll__thumb" />
        </ScrollAreaPrimitive.Scrollbar>
      ) : null}
      {orientation !== 'vertical' ? (
        <ScrollAreaPrimitive.Scrollbar orientation="horizontal" className="ui-scroll__bar">
          <ScrollAreaPrimitive.Thumb className="ui-scroll__thumb" />
        </ScrollAreaPrimitive.Scrollbar>
      ) : null}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
