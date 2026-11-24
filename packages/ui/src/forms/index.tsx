import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as RadioPrimitive from '@radix-ui/react-radio-group';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cx, type Size } from '../utils';
import { useLocaleOverrides, usePortalContainer } from '../theme/ThemeProvider';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, MinusIcon } from '../icons';
import { Field, useFieldControlProps, type FieldProps } from './Field';

export { Field, useFieldContext, useFieldControlProps, type FieldProps } from './Field';

type FieldPassThrough = Pick<FieldProps, 'label' | 'hideLabel' | 'hint' | 'error'>;

/* ---------- TextField ---------- */
export interface TextFieldProps
  extends FieldPassThrough,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Height 32 / 40 / 48 px. Default `'md'`. */
  size?: Size;
  /** Content inside the input's left edge (icon or text). */
  startAdornment?: React.ReactNode;
  /** Content inside the input's right edge. */
  endAdornment?: React.ReactNode;
  /** Show "n / maxLength" beside the label. Needs `maxLength`. */
  showCount?: boolean;
  /** Class for the outer Field wrapper. */
  fieldClassName?: string;
}

function useCharCount(value: unknown, defaultValue: unknown) {
  const [len, setLen] = React.useState(() => String(defaultValue ?? '').length);
  const length = value !== undefined ? String(value ?? '').length : len;
  return [length, setLen] as const;
}

/** Single-line text entry with label, hint and error. */
export const TextField = /* @__PURE__ */ React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    hideLabel,
    hint,
    error,
    size = 'md',
    startAdornment,
    endAdornment,
    showCount,
    maxLength,
    required,
    disabled,
    readOnly,
    id,
    className,
    fieldClassName,
    onChange,
    value,
    defaultValue,
    ...rest
  },
  ref,
) {
  const locale = useLocaleOverrides();
  const [count, setCount] = useCharCount(value, defaultValue);
  const counter =
    showCount && maxLength ? (
      <span className="ui-field__count" aria-live="polite" aria-label={(locale.characterCount ?? ((c: number, m: number) => `${c} of ${m} characters`))(count, maxLength)}>
        {count} / {maxLength}
      </span>
    ) : null;
  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      hint={hint}
      error={error}
      required={required}
      disabled={disabled}
      id={id}
      labelEnd={counter}
      className={fieldClassName}
    >
      <FieldInput
        ref={ref}
        size={size}
        startAdornment={startAdornment}
        endAdornment={endAdornment}
        className={className}
        maxLength={maxLength}
        readOnly={readOnly}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => {
          setCount(e.target.value.length);
          onChange?.(e);
        }}
        {...rest}
      />
    </Field>
  );
});

interface FieldInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  size: Size;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const FieldInput = /* @__PURE__ */ React.forwardRef<HTMLInputElement, FieldInputProps>(function FieldInput(
  { size, startAdornment, endAdornment, className, ...rest },
  ref,
) {
  const control = useFieldControlProps({ id: rest.id, 'aria-describedby': rest['aria-describedby'] });
  return (
    <div className={cx('ui-input', className)} data-size={size} data-invalid={control['aria-invalid']} data-disabled={control.disabled}>
      {startAdornment ? <span className="ui-input__adornment">{startAdornment}</span> : null}
      <input ref={ref} className="ui-input__control" {...rest} {...control} />
      {endAdornment ? <span className="ui-input__adornment">{endAdornment}</span> : null}
    </div>
  );
});

/* ---------- Textarea ---------- */
export interface TextareaProps extends FieldPassThrough, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Grow with content up to `maxRows`. */
  autoResize?: boolean;
  maxRows?: number;
  showCount?: boolean;
  fieldClassName?: string;
}

/** Multi-line text entry. */
export const Textarea = /* @__PURE__ */ React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hideLabel, hint, error, required, disabled, id, autoResize, maxRows = 10, rows = 3, showCount, maxLength, value, defaultValue, onChange, className, fieldClassName, ...rest },
  forwardedRef,
) {
  const locale = useLocaleOverrides();
  const [count, setCount] = useCharCount(value, defaultValue);
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
  const resize = React.useCallback(() => {
    const el = innerRef.current;
    if (!autoResize || !el) return;
    el.style.height = 'auto';
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 24;
    el.style.height = `${Math.min(el.scrollHeight, lineHeight * maxRows + 18)}px`;
  }, [autoResize, maxRows]);
  React.useLayoutEffect(resize, [resize, value]);

  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      hint={hint}
      error={error}
      required={required}
      disabled={disabled}
      id={id}
      className={fieldClassName}
      labelEnd={
        showCount && maxLength ? (
          <span className="ui-field__count" aria-label={(locale.characterCount ?? ((c: number, m: number) => `${c} of ${m} characters`))(count, maxLength)}>
            {count} / {maxLength}
          </span>
        ) : null
      }
    >
      {(ctx) => (
        <textarea
          ref={(el) => {
            innerRef.current = el;
            if (typeof forwardedRef === 'function') forwardedRef(el);
            else if (forwardedRef) forwardedRef.current = el;
          }}
          className={cx('ui-textarea', className)}
          rows={rows}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          id={ctx.id}
          aria-describedby={[ctx.hintId, ctx.errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={ctx.invalid || undefined}
          required={ctx.required || undefined}
          disabled={ctx.disabled || undefined}
          onChange={(e) => {
            setCount(e.target.value.length);
            resize();
            onChange?.(e);
          }}
          {...rest}
        />
      )}
    </Field>
  );
});

/* ---------- Checkbox ---------- */
export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'children'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  invalid?: boolean;
  size?: 'sm' | 'md';
}

/** A yes/no choice, or the parent of a group when `checked="indeterminate"`. */
export const Checkbox = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { label, description, invalid, size = 'md', id, className, ...rest },
  ref,
) {
  const auto = React.useId();
  const cid = id ?? `checkbox-${auto}`;
  return (
    <div className={cx('ui-choice', className)} data-size={size} data-disabled={rest.disabled || undefined}>
      <CheckboxPrimitive.Root
        ref={ref}
        id={cid}
        className="ui-checkbox"
        aria-invalid={invalid || undefined}
        aria-describedby={description ? `${cid}-desc` : undefined}
        {...rest}
      >
        <CheckboxPrimitive.Indicator className="ui-checkbox__indicator">
          {rest.checked === 'indeterminate' ? <MinusIcon size={14} strokeWidth={3} /> : <CheckIcon size={14} strokeWidth={3} />}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label || description ? (
        <div className="ui-choice__text">
          {label ? (
            <label htmlFor={cid} className="ui-choice__label">
              {label}
            </label>
          ) : null}
          {description ? (
            <p id={`${cid}-desc`} className="ui-choice__description">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});

/* ---------- RadioGroup ---------- */
export interface RadioGroupProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioPrimitive.Root>, 'dir'> {
  /** Group label (rendered as the group's accessible name). */
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
}

/** One choice from a small set of options. Arrow keys move between options. */
const RadioGroupRoot = /* @__PURE__ */ React.forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { label, hint, error, orientation = 'vertical', className, children, ...rest },
  ref,
) {
  const id = React.useId();
  return (
    <div className={cx('ui-radio-group', className)} data-invalid={error ? true : undefined}>
      {label ? (
        <span id={`${id}-label`} className="ui-field__label">
          {label}
          {rest.required ? <span className="ui-field__required" aria-hidden="true"> *</span> : null}
        </span>
      ) : null}
      <RadioPrimitive.Root
        ref={ref}
        orientation={orientation}
        className="ui-radio-group__items"
        data-orientation={orientation}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-describedby={[hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined}
        aria-invalid={error ? true : undefined}
        {...rest}
      >
        {children}
      </RadioPrimitive.Root>
      {hint ? <p id={`${id}-hint`} className="ui-field__hint">{hint}</p> : null}
      {error ? <p id={`${id}-error`} className="ui-field__error">{error}</p> : null}
    </div>
  );
});

export interface RadioProps extends Omit<React.ComponentPropsWithoutRef<typeof RadioPrimitive.Item>, 'children'> {
  label: React.ReactNode;
  description?: React.ReactNode;
}

export const Radio = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, RadioProps>(function Radio(
  { label, description, id, className, ...rest },
  ref,
) {
  const auto = React.useId();
  const rid = id ?? `radio-${auto}`;
  return (
    <div className={cx('ui-choice', className)} data-disabled={rest.disabled || undefined}>
      <RadioPrimitive.Item
        ref={ref}
        id={rid}
        className="ui-radio"
        aria-describedby={description ? `${rid}-desc` : undefined}
        {...rest}
      >
        <RadioPrimitive.Indicator className="ui-radio__indicator" />
      </RadioPrimitive.Item>
      <div className="ui-choice__text">
        <label htmlFor={rid} className="ui-choice__label">
          {label}
        </label>
        {description ? (
          <p id={`${rid}-desc`} className="ui-choice__description">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
});

export const RadioGroup = /* @__PURE__ */ Object.assign(RadioGroupRoot, { Item: Radio });

/* ---------- Switch ---------- */
export interface SwitchProps extends Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'children'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  size?: 'sm' | 'md';
}

/** Turns a setting on or off immediately (no submit needed). */
export const Switch = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, description, size = 'md', id, className, ...rest },
  ref,
) {
  const auto = React.useId();
  const sid = id ?? `switch-${auto}`;
  return (
    <div className={cx('ui-choice', 'ui-choice--switch', className)} data-size={size} data-disabled={rest.disabled || undefined}>
      <SwitchPrimitive.Root
        ref={ref}
        id={sid}
        className="ui-switch"
        aria-describedby={description ? `${sid}-desc` : undefined}
        {...rest}
      >
        <SwitchPrimitive.Thumb className="ui-switch__thumb" />
      </SwitchPrimitive.Root>
      {label || description ? (
        <div className="ui-choice__text">
          {label ? (
            <label htmlFor={sid} className="ui-choice__label">
              {label}
            </label>
          ) : null}
          {description ? (
            <p id={`${sid}-desc`} className="ui-choice__description">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});

/* ---------- Select ---------- */
export interface SelectProps
  extends FieldPassThrough,
    Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>, 'dir'> {
  placeholder?: string;
  size?: Size;
  id?: string;
  className?: string;
  fieldClassName?: string;
  /** Accessible name when there is no visible label. */
  'aria-label'?: string;
}

/** Picks one value from a short list (under ~15 options). Use Combobox for search or long lists. */
const SelectRoot = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { label, hideLabel, hint, error, placeholder, size = 'md', id, required, disabled, className, fieldClassName, children, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const locale = useLocaleOverrides();
  const container = usePortalContainer();
  return (
    <Field label={label} hideLabel={hideLabel} hint={hint} error={error} required={required} disabled={disabled} id={id} className={fieldClassName}>
      {(ctx) => (
        <SelectPrimitive.Root required={required} disabled={disabled} {...rest}>
          <SelectPrimitive.Trigger
            ref={ref}
            id={ctx.id}
            className={cx('ui-select__trigger', className)}
            data-size={size}
            aria-label={ariaLabel}
            aria-labelledby={label && !ariaLabel ? `${ctx.labelId} ${ctx.id}` : undefined}
            aria-describedby={[ctx.hintId, ctx.errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={ctx.invalid || undefined}
            data-invalid={ctx.invalid || undefined}
          >
            <SelectPrimitive.Value placeholder={placeholder ?? locale.selectPlaceholder ?? 'Select…'} />
            <SelectPrimitive.Icon className="ui-select__icon">
              <ChevronDownIcon size="sm" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal container={container}>
            <SelectPrimitive.Content className="ui-select__content ui-menu-surface" position="popper" sideOffset={4}>
              <SelectPrimitive.ScrollUpButton className="ui-select__scroll">
                <ChevronUpIcon size="sm" />
              </SelectPrimitive.ScrollUpButton>
              <SelectPrimitive.Viewport className="ui-select__viewport">{children}</SelectPrimitive.Viewport>
              <SelectPrimitive.ScrollDownButton className="ui-select__scroll">
                <ChevronDownIcon size="sm" />
              </SelectPrimitive.ScrollDownButton>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      )}
    </Field>
  );
});

export type SelectItemProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>;

export const SelectItem = /* @__PURE__ */ React.forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(
  { className, children, ...rest },
  ref,
) {
  return (
    <SelectPrimitive.Item ref={ref} className={cx('ui-menu-item', className)} {...rest}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="ui-menu-item__indicator">
        <CheckIcon size="sm" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});

export function SelectGroup({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <SelectPrimitive.Group>
      <SelectPrimitive.Label className="ui-menu-label">{label}</SelectPrimitive.Label>
      {children}
    </SelectPrimitive.Group>
  );
}

export const SelectSeparator = () => <SelectPrimitive.Separator className="ui-menu-separator" />;

export const Select = /* @__PURE__ */ Object.assign(SelectRoot, { Item: SelectItem, Group: SelectGroup, Separator: SelectSeparator });

/* ---------- Slider ---------- */
export interface SliderProps extends Omit<React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>, 'dir'> {
  label?: React.ReactNode;
  /** Show the current value(s) beside the label. */
  showValue?: boolean;
  /** Format the shown value, e.g. `(v) => \`${v}%\``. */
  formatValue?: (value: number) => string;
  /** Accessible name for each thumb when there is more than one. */
  thumbLabels?: string[];
}

/** Picks a number, or a range with two thumbs, by dragging or with arrow keys. */
export const Slider = /* @__PURE__ */ React.forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  { label, showValue, formatValue = String, thumbLabels, value, defaultValue = [0], onValueChange, className, ...rest },
  ref,
) {
  const id = React.useId();
  const [inner, setInner] = React.useState<number[]>(defaultValue);
  const current = value ?? inner;
  return (
    <div className={cx('ui-slider', className)}>
      {label || showValue ? (
        <div className="ui-progress__header">
          {label ? <span id={`${id}-label`} className="ui-field__label">{label}</span> : <span />}
          {showValue ? <span className="ui-progress__value">{current.map(formatValue).join(' – ')}</span> : null}
        </div>
      ) : null}
      <SliderPrimitive.Root
        ref={ref}
        className="ui-slider__root"
        value={value}
        defaultValue={defaultValue}
        onValueChange={(v) => {
          setInner(v);
          onValueChange?.(v);
        }}
        {...rest}
      >
        <SliderPrimitive.Track className="ui-slider__track">
          <SliderPrimitive.Range className="ui-slider__range" />
        </SliderPrimitive.Track>
        {current.map((v, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className="ui-slider__thumb"
            aria-labelledby={thumbLabels ? undefined : label ? `${id}-label` : undefined}
            aria-label={thumbLabels?.[i]}
            aria-valuetext={formatValue(v)}
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  );
});

/* ---------- NumberField ---------- */
export interface NumberFieldProps
  extends FieldPassThrough,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'min' | 'max' | 'step'> {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  /** Arrow keys and buttons change by this amount; Page Up/Down by 10×. Default 1. */
  step?: number;
  /** `Intl.NumberFormat` options for the displayed value (e.g. currency). */
  formatOptions?: Intl.NumberFormatOptions;
  size?: Size;
  fieldClassName?: string;
}

/** Number entry with increment and decrement buttons and full keyboard support. */
export const NumberField = /* @__PURE__ */ React.forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  { label, hideLabel, hint, error, value, defaultValue = null, onValueChange, min, max, step = 1, formatOptions, size = 'md', required, disabled, readOnly, id, className, fieldClassName, onBlur, onKeyDown, ...rest },
  ref,
) {
  const locale = useLocaleOverrides();
  const [inner, setInner] = React.useState<number | null>(defaultValue);
  const current = value !== undefined ? value : inner;
  const format = React.useMemo(() => new Intl.NumberFormat(undefined, formatOptions), [formatOptions]);
  const [draft, setDraft] = React.useState<string | null>(null);

  const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
  const commit = (n: number | null) => {
    const next = n === null || Number.isNaN(n) ? null : clamp(Number(n.toFixed(10)));
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };
  const bump = (delta: number) => commit(clamp((current ?? min ?? 0) + delta));
  const parse = (text: string) => {
    const cleaned = text.replace(/[^\d.,-]/g, '').replace(/,/g, '');
    return cleaned === '' || cleaned === '-' ? null : Number(cleaned);
  };

  return (
    <Field label={label} hideLabel={hideLabel} hint={hint} error={error} required={required} disabled={disabled} id={id} className={fieldClassName}>
      {(ctx) => (
        <div className={cx('ui-input', 'ui-number-field', className)} data-size={size} data-invalid={ctx.invalid || undefined} data-disabled={disabled || undefined}>
          <input
            ref={ref}
            className="ui-input__control"
            type="text"
            inputMode="decimal"
            role="spinbutton"
            autoComplete="off"
            id={ctx.id}
            aria-describedby={[ctx.hintId, ctx.errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={ctx.invalid || undefined}
            aria-valuenow={current ?? undefined}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={current === null ? undefined : format.format(current)}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            value={draft ?? (current === null ? '' : format.format(current))}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={(e) => {
              if (draft !== null) commit(parse(draft));
              setDraft(null);
              onBlur?.(e);
            }}
            onKeyDown={(e) => {
              onKeyDown?.(e);
              if (readOnly) return;
              const keys: Record<string, () => void> = {
                ArrowUp: () => bump(step),
                ArrowDown: () => bump(-step),
                PageUp: () => bump(step * 10),
                PageDown: () => bump(-step * 10),
                Home: () => min !== undefined && commit(min),
                End: () => max !== undefined && commit(max),
                Enter: () => {
                  if (draft !== null) commit(parse(draft));
                  setDraft(null);
                },
              };
              const action = keys[e.key];
              if (action) {
                e.preventDefault();
                setDraft(null);
                action();
              }
            }}
            {...rest}
          />
          <div className="ui-number-field__steppers">
            <button
              type="button"
              tabIndex={-1}
              aria-label={locale.increment ?? 'Increase'}
              disabled={disabled || readOnly || (max !== undefined && (current ?? -Infinity) >= max)}
              onClick={() => bump(step)}
            >
              <ChevronUpIcon size={14} />
            </button>
            <button
              type="button"
              tabIndex={-1}
              aria-label={locale.decrement ?? 'Decrease'}
              disabled={disabled || readOnly || (min !== undefined && (current ?? Infinity) <= min)}
              onClick={() => bump(-step)}
            >
              <ChevronDownIcon size={14} />
            </button>
          </div>
        </div>
      )}
    </Field>
  );
});

/* re-exports of advanced inputs */
export { Combobox, type ComboboxProps, type ComboboxOption } from './Combobox';
export { DatePicker, Calendar, type DatePickerProps, type CalendarProps } from './DatePicker';

