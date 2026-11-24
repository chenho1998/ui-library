import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cx, mergeRefs, useControllableState, type Size } from '../utils';
import { useLocaleOverrides, usePortalContainer } from '../theme/ThemeProvider';
import { CheckIcon, ChevronDownIcon, XIcon } from '../icons';
import { Spinner } from '../feedback/Spinner';
import { Field, type FieldContextValue, type FieldProps } from './Field';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface ComboboxBaseProps extends Pick<FieldProps, 'label' | 'hideLabel' | 'hint' | 'error'> {
  options: ComboboxOption[];
  /** Called as the user types; use it to load options from a server (with `filter={false}` and `loading`). */
  onInputChange?: (query: string) => void;
  /** Custom filter. Default: case-insensitive "contains" on the label. Pass `false` when filtering on a server. */
  filter?: ((option: ComboboxOption, query: string) => boolean) | false;
  /** Shows a spinner and marks the list busy while options load. */
  loading?: boolean;
  placeholder?: string;
  emptyMessage?: React.ReactNode;
  size?: Size;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  /** Form field name. With `multiple`, one hidden input is submitted per selected value. */
  name?: string;
  /** Controlled open state of the option list. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  fieldClassName?: string;
}

export interface ComboboxSingleProps extends ComboboxBaseProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
}

export interface ComboboxMultipleProps extends ComboboxBaseProps {
  /** Pick several values. They show as removable tags; Backspace in the empty input removes the last one. */
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

const defaultFilter = (o: ComboboxOption, q: string) => o.label.toLowerCase().includes(q.trim().toLowerCase());
const toArray = (v: string | string[] | null | undefined): string[] => (v == null ? [] : Array.isArray(v) ? v : [v]);

/**
 * Text input with a filtered list of options (WAI-ARIA combobox pattern).
 * Use for long lists or when users know what they are looking for. Pass `multiple` to pick several.
 */
export const Combobox = /* @__PURE__ */ React.forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(props, ref) {
  const {
    label, hideLabel, hint, error, options, onInputChange, filter = defaultFilter, loading, placeholder, emptyMessage,
    size = 'md', required, disabled, id, name, open: controlledOpen, defaultOpen = false, onOpenChange, className, fieldClassName,
  } = props;
  const multiple = props.multiple === true;
  const locale = useLocaleOverrides();
  const container = usePortalContainer();
  const listId = React.useId();

  const controlled = props.value !== undefined;
  const [inner, setInner] = React.useState<string[]>(() => toArray(props.defaultValue));
  const selected = controlled ? toArray(props.value) : inner;
  // Options the user picked, so their labels survive when async `options` no longer include them.
  const [picked, setPicked] = React.useState<ReadonlyMap<string, ComboboxOption>>(() => new Map());
  const optionFor = (v: string): ComboboxOption =>
    options.find((o) => o.value === v) ?? picked.get(v) ?? { value: v, label: v };

  const [open, setOpen] = useControllableState(controlledOpen, defaultOpen, onOpenChange);
  const [query, setQuery] = React.useState<string | null>(null); // null = not typing; show selected label
  const [active, setActive] = React.useState(-1);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const setInputRef = React.useMemo(() => mergeRefs(inputRef, ref), [ref]);

  const visible = React.useMemo(
    () => (query === null || filter === false ? options : options.filter((o) => filter(o, query))),
    [options, query, filter],
  );

  const commit = (next: string[]) => {
    if (!controlled) setInner(next);
    if (props.multiple) props.onValueChange?.(next);
    else props.onValueChange?.(next[0] ?? null);
  };

  const choose = (option: ComboboxOption) => {
    if (option.disabled) return;
    setPicked((m) => new Map(m).set(option.value, option));
    if (!multiple) {
      commit([option.value]);
      setQuery(null);
      setOpen(false);
      return;
    }
    commit(selected.includes(option.value) ? selected.filter((v) => v !== option.value) : [...selected, option.value]);
    // Clear the typed text so the next value can be searched; keep the list open on the same option.
    if (query) {
      setQuery(null);
      onInputChange?.('');
      setActive(filter === false ? active : options.findIndex((o) => o.value === option.value));
    }
  };

  const remove = (v: string) => commit(selected.filter((s) => s !== v));

  const move = (dir: 1 | -1) => {
    if (!visible.length) return;
    let i = active;
    for (let n = 0; n < visible.length; n++) {
      i = (i + dir + visible.length) % visible.length;
      if (!visible.at(i)?.disabled) {
        setActive(i);
        return;
      }
    }
    setActive(-1);
  };

  const openList = () => {
    if (disabled) return;
    setOpen(true);
    setActive(visible.findIndex((o) => o.value === selected[0]));
  };

  React.useEffect(() => {
    if (!open || active < 0) return;
    document.getElementById(`${listId}-opt-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open, listId]);

  const activeOption = active >= 0 ? visible.at(active) : undefined;
  const single = multiple ? undefined : selected[0] !== undefined ? optionFor(selected[0]) : undefined;
  const formatResults = locale.results ?? ((c: number) => (c === 1 ? '1 result' : `${c} results`));
  const status = open && query ? (loading ? (locale.loading ?? 'Loading') : formatResults(visible.length)) : '';

  const renderInput = (ctx: FieldContextValue) => (
    <input
      ref={setInputRef}
      id={ctx.id}
      className="ui-input__control"
      role="combobox"
      aria-expanded={open}
      aria-controls={listId}
      aria-autocomplete="list"
      aria-activedescendant={open && activeOption ? `${listId}-opt-${active}` : undefined}
      aria-describedby={[ctx.hintId, ctx.errorId].filter(Boolean).join(' ') || undefined}
      aria-invalid={ctx.invalid || undefined}
      aria-required={required || undefined}
      autoComplete="off"
      // With tags, the text box is empty once values are chosen, so only require it when none are.
      required={required && selected.length === 0}
      disabled={disabled}
      placeholder={multiple && selected.length > 0 ? undefined : placeholder}
      value={query ?? single?.label ?? ''}
      onChange={(e) => {
        setQuery(e.target.value);
        onInputChange?.(e.target.value);
        setOpen(true);
        setActive(0);
        if (e.target.value === '' && !multiple) {
          commit([]);
          setQuery(null);
          setOpen(false);
        }
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
          if (activeOption) choose(activeOption);
        } else if (e.key === 'Escape') {
          if (open) setOpen(false);
          else if (!multiple) commit([]);
          setQuery(null);
        } else if (e.key === 'Tab' && open) {
          setOpen(false);
        } else if (e.key === 'Backspace' && multiple && !query && selected.length > 0) {
          remove(selected[selected.length - 1]!);
        }
      }}
    />
  );

  return (
    <Field label={label} hideLabel={hideLabel} hint={hint} error={error} required={required} disabled={disabled} id={id} className={fieldClassName}>
      {(ctx) => (
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
          <PopoverPrimitive.Anchor asChild>
            {/* Pointer convenience only: keyboard users reach the input directly. */}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
              ref={anchorRef}
              className={cx('ui-input', 'ui-combobox', className)}
              data-size={size}
              data-multiple={multiple || undefined}
              data-invalid={ctx.invalid || undefined}
              data-disabled={disabled || undefined}
              onMouseDown={(e) => {
                // Clicking the empty space around the tags focuses the input.
                if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('ui-combobox__values')) {
                  e.preventDefault();
                  inputRef.current?.focus();
                }
              }}
            >
              {multiple ? (
                <div className="ui-combobox__values">
                  {selected.map((v) => {
                    const o = optionFor(v);
                    return (
                      <span key={v} className="ui-tag ui-combobox__tag" data-tone="neutral" data-disabled={disabled || undefined}>
                        <span className="ui-tag__label">{o.label}</span>
                        <button
                          type="button"
                          className="ui-tag__remove"
                          aria-label={(locale.removeItem ?? ((l: string) => `Remove ${l}`))(o.label)}
                          disabled={disabled}
                          onClick={() => {
                            remove(v);
                            inputRef.current?.focus();
                          }}
                        >
                          <XIcon size={12} strokeWidth={2.5} />
                        </button>
                      </span>
                    );
                  })}
                  {renderInput(ctx)}
                </div>
              ) : (
                renderInput(ctx)
              )}
              {name ? selected.map((v) => <input key={v} type="hidden" name={name} value={v} />) : null}
              {name && selected.length === 0 && !multiple ? <input type="hidden" name={name} value="" /> : null}
              {loading ? <Spinner size="sm" decorative className="ui-combobox__spinner" /> : null}
              <span
                className="ui-input__adornment ui-combobox__toggle"
                aria-hidden="true"
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (open) setOpen(false);
                  else {
                    openList();
                    inputRef.current?.focus();
                  }
                }}
              >
                <ChevronDownIcon size="sm" />
              </span>
            </div>
          </PopoverPrimitive.Anchor>
          <span className="ui-visually-hidden" role="status" aria-live="polite">
            {status}
          </span>
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
              <ul
                id={listId}
                role="listbox"
                aria-labelledby={ctx.labelId}
                aria-multiselectable={multiple || undefined}
                aria-busy={loading || undefined}
                className="ui-combobox__list"
              >
                {visible.length === 0 ? (
                  <li className="ui-combobox__empty" role="presentation">
                    {loading ? (
                      <>
                        <Spinner size="sm" decorative /> {locale.loading ?? 'Loading'}
                      </>
                    ) : (
                      (emptyMessage ?? locale.noResults ?? 'No results')
                    )}
                  </li>
                ) : (
                  visible.map((o, i) => {
                    const isSelected = selected.includes(o.value);
                    return (
                      // Keyboard selection runs through the input (aria-activedescendant), so options only need clicks.
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                      <li
                        key={o.value}
                        id={`${listId}-opt-${i}`}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={o.disabled || undefined}
                        data-highlighted={i === active ? '' : undefined}
                        data-disabled={o.disabled ? '' : undefined}
                        className="ui-menu-item"
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseMove={() => !o.disabled && setActive(i)}
                        onClick={() => choose(o)}
                      >
                        <span className="ui-menu-item__text">
                          {o.label}
                          {o.description ? <span className="ui-menu-item__description">{o.description}</span> : null}
                        </span>
                        {isSelected ? (
                          <span className="ui-menu-item__indicator">
                            <CheckIcon size="sm" />
                          </span>
                        ) : null}
                      </li>
                    );
                  })
                )}
              </ul>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      )}
    </Field>
  );
});
