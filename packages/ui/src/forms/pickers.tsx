import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cx, useControllableState, type Size } from '../utils';
import { useLocaleOverrides, usePortalContainer } from '../theme/ThemeProvider';
import { CalendarIcon, ClockIcon } from '../icons';
import { Field, type FieldProps } from './Field';
import { Calendar } from './DatePicker';

const TEXT = { chooseTime: 'Choose time', hours: 'Hours', minutes: 'Minutes', startDate: 'Start date', endDate: 'End date' };

const pad = (n: number) => String(n).padStart(2, '0');
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/* ---------- TimePicker ---------- */
export interface TimePickerProps extends Pick<FieldProps, 'label' | 'hideLabel' | 'hint' | 'error'> {
  /** 24-hour `"HH:mm"`, e.g. `"14:30"`. Shown in the user's locale format. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Minutes between choices. Default 5. */
  minuteStep?: number;
  /** BCP 47 locale for the shown time. Defaults to the browser's. */
  locale?: string;
  placeholder?: string;
  size?: Size;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  fieldClassName?: string;
}

function TimeColumn({ label, options, value, onChange, onDone, focusOnMount }: {
  label: string;
  options: number[];
  value: number | null;
  onChange: (n: number) => void;
  onDone: () => void;
  focusOnMount?: boolean;
}) {
  const id = React.useId();
  const ref = React.useRef<HTMLUListElement>(null);
  const index = value === null ? -1 : options.indexOf(value);
  React.useEffect(() => {
    if (index >= 0) document.getElementById(`${id}-${index}`)?.scrollIntoView({ block: 'nearest' });
  }, [index, id]);
  React.useEffect(() => {
    if (focusOnMount) ref.current?.focus();
  }, [focusOnMount]);
  return (
    <ul
      ref={ref}
      role="listbox"
      aria-label={label}
      tabIndex={0}
      aria-activedescendant={index >= 0 ? `${id}-${index}` : undefined}
      className="ui-time__column"
      onKeyDown={(e) => {
        const last = options.length - 1;
        const moves: Record<string, number> = {
          ArrowDown: index >= last ? 0 : index + 1, ArrowUp: index <= 0 ? last : index - 1, Home: 0, End: last,
          PageDown: Math.min(last, index + 5), PageUp: Math.max(0, index - 5),
        };
        if (e.key in moves) {
          e.preventDefault();
          onChange(options[moves[e.key]!]!);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          onDone();
        }
      }}
    >
      {options.map((n, i) => (
        // Keyboard selection runs through the listbox (aria-activedescendant).
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <li key={n} id={`${id}-${i}`} role="option" aria-selected={i === index} className="ui-time__option" data-selected={i === index || undefined} onClick={() => onChange(n)}>
          {pad(n)}
        </li>
      ))}
    </ul>
  );
}

/** Picks a time of day from hour and minute columns. */
export const TimePicker = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, TimePickerProps>(function TimePicker(
  {
    label, hideLabel, hint, error, value, defaultValue = null, onValueChange, open: controlledOpen, defaultOpen = false, onOpenChange,
    minuteStep = 5, locale: lang, placeholder, size = 'md', required, disabled, name, id, className, fieldClassName,
  },
  ref,
) {
  const locale = useLocaleOverrides();
  const container = usePortalContainer();
  const [current, setCurrent] = useControllableState<string | null>(value, defaultValue, onValueChange);
  const [open, setOpen] = useControllableState(controlledOpen, defaultOpen, onOpenChange);
  const [h, m] = current ? current.split(':').map(Number) : [null, null];
  const timeFmt = React.useMemo(() => new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: '2-digit' }), [lang]);
  const shown = current ? timeFmt.format(new Date(2000, 0, 1, h!, m!)) : null;
  const set = (hour: number, minute: number) => setCurrent(`${pad(hour)}:${pad(minute)}`);
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);

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
              aria-describedby={[ctx.hintId, ctx.errorId].filter(Boolean).join(' ') || undefined}
            >
              <span className="ui-date-picker__value">{shown ?? placeholder ?? (locale.chooseTime ?? TEXT.chooseTime)}</span>
              <ClockIcon size="sm" className="ui-icon ui-date-picker__icon" />
            </button>
          </PopoverPrimitive.Trigger>
          {name ? <input type="hidden" name={name} value={current ?? ''} /> : null}
          <PopoverPrimitive.Portal container={container}>
            <PopoverPrimitive.Content className="ui-popover ui-time" align="start" sideOffset={4} role="dialog" aria-label={(locale.chooseTime ?? TEXT.chooseTime)} onOpenAutoFocus={(e) => e.preventDefault()}>
              <TimeColumn label={(locale.hours ?? TEXT.hours)} options={Array.from({ length: 24 }, (_, i) => i)} value={h} onChange={(n) => set(n, m ?? 0)} onDone={() => setOpen(false)} focusOnMount />
              <TimeColumn
                label={(locale.minutes ?? TEXT.minutes)}
                options={minutes}
                value={m === null ? null : minutes.reduce((best, x) => (Math.abs(x - m) < Math.abs(best - m) ? x : best), 0)}
                onChange={(n) => set(h ?? 0, n)}
                onDone={() => setOpen(false)}
              />
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      )}
    </Field>
  );
});

/* ---------- DateRangePicker ---------- */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerProps extends Pick<FieldProps, 'label' | 'hideLabel' | 'hint' | 'error'> {
  value?: DateRange;
  defaultValue?: DateRange;
  /** Called once both dates are picked (the end is never before the start). */
  onValueChange?: (range: DateRange) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  min?: Date;
  max?: Date;
  isDateDisabled?: (date: Date) => boolean;
  /** BCP 47 locale. Defaults to the browser's. */
  locale?: string;
  /** Display format. Default `{ dateStyle: 'medium' }`. */
  formatOptions?: Intl.DateTimeFormatOptions;
  weekStartsOn?: number;
  placeholder?: string;
  size?: Size;
  required?: boolean;
  disabled?: boolean;
  /** Form field names for the two ISO dates. */
  startName?: string;
  endName?: string;
  id?: string;
  className?: string;
  fieldClassName?: string;
}

const EMPTY_RANGE: DateRange = { start: null, end: null };
const DEFAULT_RANGE_FORMAT: Intl.DateTimeFormatOptions = { dateStyle: 'medium' };

/** Picks a start and an end date in one calendar: the first click sets the start, the second the end. */
export const DateRangePicker = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, DateRangePickerProps>(function DateRangePicker(
  {
    label, hideLabel, hint, error, value, defaultValue = EMPTY_RANGE, onValueChange, open: controlledOpen, defaultOpen = false, onOpenChange,
    min, max, isDateDisabled, locale: lang, formatOptions = DEFAULT_RANGE_FORMAT, weekStartsOn, placeholder, size = 'md', required, disabled,
    startName, endName, id, className, fieldClassName,
  },
  ref,
) {
  const locale = useLocaleOverrides();
  const container = usePortalContainer();
  const [current, setCurrent] = useControllableState<DateRange>(value, defaultValue, onValueChange);
  const [open, setOpen] = useControllableState(controlledOpen, defaultOpen, onOpenChange);
  const [draft, setDraft] = React.useState<DateRange>(current);
  const fmt = React.useMemo(() => new Intl.DateTimeFormat(lang, formatOptions), [lang, formatOptions]);
  const shown =
    current.start && current.end ? fmt.formatRange(current.start, current.end) : current.start ? `${fmt.format(current.start)} – …` : null;

  return (
    <Field label={label} hideLabel={hideLabel} hint={hint} error={error} required={required} disabled={disabled} id={id} className={fieldClassName}>
      {(ctx) => (
        <PopoverPrimitive.Root
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (next) setDraft(current);
          }}
        >
          <PopoverPrimitive.Trigger asChild>
            <button
              ref={ref}
              type="button"
              id={ctx.id}
              className={cx('ui-input', 'ui-date-picker__trigger', className)}
              data-size={size}
              data-invalid={ctx.invalid || undefined}
              data-placeholder={shown ? undefined : ''}
              disabled={disabled}
              aria-haspopup="dialog"
              aria-labelledby={label ? `${ctx.labelId} ${ctx.id}` : undefined}
              aria-describedby={[ctx.hintId, ctx.errorId].filter(Boolean).join(' ') || undefined}
            >
              <span className="ui-date-picker__value">{shown ?? placeholder ?? `${(locale.startDate ?? TEXT.startDate)} – ${(locale.endDate ?? TEXT.endDate)}`}</span>
              <CalendarIcon size="sm" className="ui-icon ui-date-picker__icon" />
            </button>
          </PopoverPrimitive.Trigger>
          {startName ? <input type="hidden" name={startName} value={current.start ? toIso(current.start) : ''} /> : null}
          {endName ? <input type="hidden" name={endName} value={current.end ? toIso(current.end) : ''} /> : null}
          <PopoverPrimitive.Portal container={container}>
            <PopoverPrimitive.Content className="ui-popover ui-date-picker__content" align="start" sideOffset={4} aria-label={locale.chooseDate ?? 'Choose date'} role="dialog">
              <p className="ui-date-range__hint" aria-live="polite">
                {draft.start && !draft.end ? (locale.endDate ?? TEXT.endDate) : (locale.startDate ?? TEXT.startDate)}
              </p>
              <Calendar
                range={draft}
                min={min}
                max={max}
                isDateDisabled={isDateDisabled}
                locale={lang}
                weekStartsOn={weekStartsOn}
                // WAI-ARIA date picker dialog: focus moves into the grid when it opens.
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                onSelect={(d) => {
                  if (!draft.start || draft.end) {
                    setDraft({ start: d, end: null });
                    return;
                  }
                  const next = d < draft.start ? { start: d, end: draft.start } : { start: draft.start, end: d };
                  setDraft(next);
                  setCurrent(next);
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
