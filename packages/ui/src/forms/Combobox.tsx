import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cx, type Size } from '../utils';
import { useLocale, usePortalContainer } from '../theme/ThemeProvider';
import { CheckIcon, ChevronDownIcon } from '../icons';
import { Field, type FieldProps } from './Field';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps extends Pick<FieldProps, 'label' | 'hideLabel' | 'hint' | 'error'> {
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Called as the user types; use it to load options from a server. */
  onInputChange?: (query: string) => void;
  /** Custom filter. Default: case-insensitive "contains" on the label. Pass `false` when filtering on a server. */
  filter?: ((option: ComboboxOption, query: string) => boolean) | false;
  placeholder?: string;
  emptyMessage?: React.ReactNode;
  size?: Size;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  fieldClassName?: string;
}

const defaultFilter = (o: ComboboxOption, q: string) => o.label.toLowerCase().includes(q.trim().toLowerCase());

/**
 * Text input with a filtered list of options (WAI-ARIA combobox pattern).
 * Use for long lists or when users know what they are looking for.
 */
export const Combobox = /* @__PURE__ */ React.forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    label, hideLabel, hint, error, options, value, defaultValue = null, onValueChange, onInputChange,
    filter = defaultFilter, placeholder, emptyMessage, size = 'md', required, disabled, id, name, className, fieldClassName,
  },
  ref,
) {
  const locale = useLocale();
  const container = usePortalContainer();
  const listId = React.useId();
  const [inner, setInner] = React.useState<string | null>(defaultValue);
  const selected = value !== undefined ? value : inner;
  const selectedOption = options.find((o) => o.value === selected) ?? null;

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState<string | null>(null); // null = not typing; show selected label
  const [active, setActive] = React.useState(-1);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const visible = React.useMemo(
    () => (query === null || filter === false ? options : options.filter((o) => filter(o, query))),
    [options, query, filter],
  );

  const select = (option: ComboboxOption | null) => {
    if (option?.disabled) return;
    if (value === undefined) setInner(option?.value ?? null);
    onValueChange?.(option?.value ?? null);
    setQuery(null);
    setOpen(false);
  };

  const move = (dir: 1 | -1) => {
    if (!visible.length) return;
    let i = active;
    for (let n = 0; n < visible.length; n++) {
      i = (i + dir + visible.length) % visible.length;
      if (!visible.at(i)?.disabled) break;
    }
    setActive(i);
  };

  const openList = () => {
    if (disabled) return;
    setOpen(true);
    const idx = visible.findIndex((o) => o.value === selected);
    setActive(idx);
  };

  React.useEffect(() => {
    if (!open || active < 0) return;
    document.getElementById(`${listId}-opt-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open, listId]);

  const activeOption = active >= 0 ? visible.at(active) : undefined;

  return (
    <Field label={label} hideLabel={hideLabel} hint={hint} error={error} required={required} disabled={disabled} id={id} className={fieldClassName}>
      {(ctx) => (
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
          <PopoverPrimitive.Anchor asChild>
            <div ref={anchorRef} className={cx('ui-input', 'ui-combobox', className)} data-size={size} data-invalid={ctx.invalid || undefined} data-disabled={disabled || undefined}>
              <input
                ref={ref}
                id={ctx.id}
                className="ui-input__control"
                role="combobox"
                aria-expanded={open}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={open && activeOption ? `${listId}-opt-${active}` : undefined}
                aria-describedby={[ctx.hintId, ctx.errorId].filter(Boolean).join(' ') || undefined}
                aria-invalid={ctx.invalid || undefined}
                autoComplete="off"
                required={required}
                disabled={disabled}
                placeholder={placeholder}
                value={query ?? selectedOption?.label ?? ''}
                onChange={(e) => {
                  setQuery(e.target.value);
                  onInputChange?.(e.target.value);
                  setOpen(true);
                  setActive(0);
                  if (e.target.value === '') select(null);
                }}
                onClick={() => (open ? setOpen(false) : openList())}
                onBlur={() => setQuery(null)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (!open) openList();
                    else move(1);
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (!open) openList();
                    else move(-1);
                  } else if (e.key === 'Enter' && open) {
                    e.preventDefault();
                    if (activeOption) select(activeOption);
                  } else if (e.key === 'Escape') {
                    if (open) setOpen(false);
                    else select(null);
                    setQuery(null);
                  } else if (e.key === 'Tab' && open) {
                    setOpen(false);
                  }
                }}
              />
              {name ? <input type="hidden" name={name} value={selected ?? ''} /> : null}
              <span
                className="ui-input__adornment ui-combobox__toggle"
                aria-hidden="true"
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (open) setOpen(false);
                  else {
                    openList();
                    anchorRef.current?.querySelector('input')?.focus();
                  }
                }}
              >
                <ChevronDownIcon size="sm" />
              </span>
            </div>
          </PopoverPrimitive.Anchor>
          <PopoverPrimitive.Portal container={container}>
            <PopoverPrimitive.Content
              className="ui-combobox__content ui-menu-surface"
              align="start"
              sideOffset={4}
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
              onInteractOutside={(e) => {
                if (anchorRef.current?.contains(e.target as Node)) e.preventDefault();
              }}
            >
              <ul id={listId} role="listbox" aria-labelledby={ctx.labelId} className="ui-combobox__list">
                {visible.length === 0 ? (
                  <li className="ui-combobox__empty" role="presentation">
                    {emptyMessage ?? locale.noResults}
                  </li>
                ) : (
                  visible.map((o, i) => (
                    <li
                      key={o.value}
                      id={`${listId}-opt-${i}`}
                      role="option"
                      aria-selected={o.value === selected}
                      aria-disabled={o.disabled || undefined}
                      data-highlighted={i === active ? '' : undefined}
                      data-disabled={o.disabled ? '' : undefined}
                      className="ui-menu-item"
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseMove={() => !o.disabled && setActive(i)}
                      onClick={() => select(o)}
                    >
                      <span className="ui-menu-item__text">
                        {o.label}
                        {o.description ? <span className="ui-menu-item__description">{o.description}</span> : null}
                      </span>
                      {o.value === selected ? (
                        <span className="ui-menu-item__indicator">
                          <CheckIcon size="sm" />
                        </span>
                      ) : null}
                    </li>
                  ))
                )}
              </ul>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      )}
    </Field>
  );
});
