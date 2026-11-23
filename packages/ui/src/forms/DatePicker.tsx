import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cx, type Size } from '../utils';
import { useLocale, usePortalContainer } from '../theme/ThemeProvider';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { Field, type FieldProps } from './Field';

/* ---------- date helpers (local time, no time-of-day) ---------- */
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last));
};
const sameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

function weekStart(locale?: string): number {
  try {
    const loc = new Intl.Locale(locale ?? navigator.language) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const info = loc.getWeekInfo?.() ?? loc.weekInfo;
    if (info) return info.firstDay % 7; // Intl: 1 = Monday … 7 = Sunday
  } catch {
    /* fall through */
  }
  return 1;
}

/* ---------- Calendar ---------- */
export interface CalendarProps {
  value?: Date | null;
  onSelect?: (date: Date) => void;
  min?: Date;
  max?: Date;
  /** Disable specific dates, e.g. weekends. */
  isDateDisabled?: (date: Date) => boolean;
  /** BCP 47 locale for month and weekday names. Defaults to the browser's. */
  locale?: string;
  /** 0 = Sunday … 6 = Saturday. Defaults to the locale's first day of the week. */
  weekStartsOn?: number;
  /** Move focus into the grid on mount. */
  autoFocus?: boolean;
  /** Range mode: highlights start, end and the days between (the end follows the pointer while it is unset). */
  range?: { start: Date | null; end: Date | null };
  className?: string;
}

/** A month grid for picking a date, following the WAI-ARIA date picker dialog pattern. */
export function Calendar({ value, onSelect, min, max, isDateDisabled, locale: lang, weekStartsOn, autoFocus, range, className }: CalendarProps) {
  const locale = useLocale();
  const titleId = React.useId();
  const [focused, setFocused] = React.useState(() => startOfDay(value ?? range?.start ?? new Date()));
  const [hovered, setHovered] = React.useState<Date | null>(null);
  const rangeStart = range?.start ?? null;
  const rangeEnd = range ? (range.end ?? (rangeStart ? (hovered ?? focused) : null)) : null;
  const [lo, hi] = rangeStart && rangeEnd && rangeEnd < rangeStart ? [rangeEnd, rangeStart] : [rangeStart, rangeEnd];
  const gridRef = React.useRef<HTMLTableElement>(null);
  const keyboardMoved = React.useRef(autoFocus ?? false);
  const first = weekStartsOn ?? weekStart(lang);

  const disabled = (d: Date) =>
    (min && d < startOfDay(min)) || (max && d > startOfDay(max)) || (isDateDisabled?.(d) ?? false);

  React.useEffect(() => {
    if (!keyboardMoved.current) return;
    gridRef.current?.querySelector<HTMLButtonElement>('button[tabindex="0"]')?.focus();
  }, [focused]);

  const monthStart = new Date(focused.getFullYear(), focused.getMonth(), 1);
  const offset = (monthStart.getDay() - first + 7) % 7;
  const gridStart = addDays(monthStart, -offset);
  const weeks = Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(gridStart, w * 7 + d)));
  const monthFmt = new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric' });
  const dayFmt = new Intl.DateTimeFormat(lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const weekdayShort = new Intl.DateTimeFormat(lang, { weekday: 'short' });
  const weekdayLong = new Intl.DateTimeFormat(lang, { weekday: 'long' });
  const today = startOfDay(new Date());

  const move = (next: Date) => {
    keyboardMoved.current = true;
    setFocused(next);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const dow = (focused.getDay() - first + 7) % 7;
    const map: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -dow),
      End: () => addDays(focused, 6 - dow),
      PageUp: () => addMonths(focused, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, e.shiftKey ? 12 : 1),
    };
    const fn = map[e.key];
    if (fn) {
      e.preventDefault();
      move(fn());
    }
  };

  return (
    <div className={cx('ui-calendar', className)}>
      <div className="ui-calendar__header">
        <button type="button" className="ui-calendar__nav" aria-label={locale.previousMonth} onClick={() => setFocused(addMonths(focused, -1))}>
          <ChevronLeftIcon size="sm" />
        </button>
        <h2 id={titleId} className="ui-calendar__title" aria-live="polite">
          {monthFmt.format(focused)}
        </h2>
        <button type="button" className="ui-calendar__nav" aria-label={locale.nextMonth} onClick={() => setFocused(addMonths(focused, 1))}>
          <ChevronRightIcon size="sm" />
        </button>
      </div>
      <table ref={gridRef} role="grid" aria-labelledby={titleId} className="ui-calendar__grid" onKeyDown={onKeyDown}>
        <thead>
          <tr>
            {weeks[0]!.map((d) => (
              <th key={d.getDay()} scope="col" abbr={weekdayLong.format(d)}>
                {weekdayShort.format(d).slice(0, 2)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((d) => {
                const outside = d.getMonth() !== focused.getMonth();
                const isEdge = !!range && (sameDay(d, lo) || sameDay(d, hi));
                const inRange = !!lo && !!hi && d > lo && d < hi;
                const isSelected = range ? isEdge : sameDay(d, value);
                const isDisabled = disabled(d);
                return (
                  <td key={d.toISOString()} role="gridcell" aria-selected={isSelected || inRange || undefined}>
                    <button
                      type="button"
                      tabIndex={sameDay(d, focused) ? 0 : -1}
                      className="ui-calendar__day"
                      data-outside={outside || undefined}
                      data-today={sameDay(d, today) || undefined}
                      data-selected={isSelected || undefined}
                      data-in-range={inRange || undefined}
                      onMouseEnter={range ? () => setHovered(d) : undefined}
                      aria-label={dayFmt.format(d)}
                      aria-current={sameDay(d, today) ? 'date' : undefined}
                      aria-disabled={isDisabled || undefined}
                      onClick={() => {
                        if (isDisabled) return;
                        setFocused(d);
                        onSelect?.(d);
                      }}
                    >
                      {d.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- DatePicker ---------- */
export interface DatePickerProps extends Pick<FieldProps, 'label' | 'hideLabel' | 'hint' | 'error'> {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  isDateDisabled?: (date: Date) => boolean;
  placeholder?: string;
  /** BCP 47 locale for formatting. Defaults to the browser's. */
  locale?: string;
  /** Display format. Default `{ dateStyle: 'medium' }`. */
  formatOptions?: Intl.DateTimeFormatOptions;
  weekStartsOn?: number;
  size?: Size;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  /** Submits the value as YYYY-MM-DD under this name. */
  name?: string;
  className?: string;
  fieldClassName?: string;
}

const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** A button that opens a calendar dialog for choosing one date. */
export const DatePicker = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(
  {
    label, hideLabel, hint, error, value, defaultValue = null, onValueChange, min, max, isDateDisabled,
    placeholder, locale: lang, formatOptions = { dateStyle: 'medium' }, weekStartsOn, size = 'md',
    required, disabled, id, name, className, fieldClassName,
  },
  ref,
) {
  const locale = useLocale();
  const container = usePortalContainer();
  const [inner, setInner] = React.useState<Date | null>(defaultValue);
  const current = value !== undefined ? value : inner;
  const [open, setOpen] = React.useState(false);
  const fmt = new Intl.DateTimeFormat(lang, formatOptions);

  return (
    <Field label={label} hideLabel={hideLabel} hint={hint} error={error} required={required} disabled={disabled} id={id} className={fieldClassName}>
      {(ctx) => (
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
          <PopoverPrimitive.Trigger asChild>
            <button
              ref={ref}
              type="button"
              id={ctx.id}
              className={cx('ui-input', 'ui-date-picker__trigger', className)}
              data-size={size}
              data-invalid={ctx.invalid || undefined}
              data-placeholder={current ? undefined : ''}
              disabled={disabled}
              aria-haspopup="dialog"
              aria-labelledby={label ? `${ctx.labelId} ${ctx.id}` : undefined}
              // A button can't carry aria-invalid/aria-required; the label marks "required" and the error is in the description.
              aria-describedby={[ctx.hintId, ctx.errorId].filter(Boolean).join(' ') || undefined}
            >
              <span className="ui-date-picker__value">{current ? fmt.format(current) : (placeholder ?? locale.chooseDate)}</span>
              <CalendarIcon size="sm" className="ui-icon ui-date-picker__icon" />
            </button>
          </PopoverPrimitive.Trigger>
          {name ? <input type="hidden" name={name} value={current ? toIso(current) : ''} /> : null}
          <PopoverPrimitive.Portal container={container}>
            <PopoverPrimitive.Content className="ui-popover ui-date-picker__content" align="start" sideOffset={4} aria-label={locale.chooseDate} role="dialog">
              <Calendar
                value={current}
                min={min}
                max={max}
                isDateDisabled={isDateDisabled}
                locale={lang}
                weekStartsOn={weekStartsOn}
                // WAI-ARIA date picker dialog: focus moves to the selected (or today's) day when it opens.
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                onSelect={(d) => {
                  if (value === undefined) setInner(d);
                  onValueChange?.(d);
                  setOpen(false);
                }}
              />
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      )}
    </Field>
  );
});
