import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cx, mergeRefs, useControllableState, type Size } from '../utils';
import { useLocaleOverrides } from '../theme/ThemeProvider';
import { FileIcon, StarIcon, UploadIcon, XIcon } from '../icons';
import { Field, type FieldProps } from './Field';

/* ---------- SegmentedControl ---------- */
export interface SegmentedControlItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  items: SegmentedControlItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Names the group for screen readers. */
  'aria-label': string;
  size?: Size;
  /** Stretch to the container's width. */
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

/** Picks one of 2–5 options that switch a view or mode, e.g. List / Board / Calendar. Always has a value. */
export const SegmentedControl = /* @__PURE__ */ React.forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  { items, value, defaultValue, onValueChange, size = 'md', fullWidth, disabled, className, 'aria-label': ariaLabel },
  ref,
) {
  const [inner, setInner] = React.useState(defaultValue ?? items[0]?.value ?? '');
  const current = value ?? inner;
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      type="single"
      aria-label={ariaLabel}
      value={current}
      disabled={disabled}
      onValueChange={(next) => {
        if (!next) return; // a segmented control never becomes empty
        if (value === undefined) setInner(next);
        onValueChange?.(next);
      }}
      className={cx('ui-segmented', className)}
      data-size={size}
      data-full-width={fullWidth || undefined}
    >
      {items.map((item) => (
        <ToggleGroupPrimitive.Item key={item.value} value={item.value} disabled={item.disabled} className="ui-segmented__item">
          {item.icon ? <span className="ui-segmented__icon">{item.icon}</span> : null}
          {item.label}
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  );
});

/* ---------- ToggleGroup ---------- */
export type ToggleGroupProps = Omit<React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>, 'type' | 'value' | 'defaultValue' | 'onValueChange'> & {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  'aria-label': string;
};

const ToggleGroupRoot = /* @__PURE__ */ React.forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup({ className, ...rest }, ref) {
  return <ToggleGroupPrimitive.Root ref={ref} type="multiple" className={cx('ui-segmented', 'ui-toggle-group', className)} {...rest} />;
});

const ToggleGroupItem = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>>(
  function ToggleGroupItem({ className, ...rest }, ref) {
    return <ToggleGroupPrimitive.Item ref={ref} className={cx('ui-segmented__item', className)} {...rest} />;
  },
);

/** A set of on/off toggles that can be combined, e.g. Bold / Italic / Underline. */
export const ToggleGroup = /* @__PURE__ */ Object.assign(ToggleGroupRoot, { Item: ToggleGroupItem });

/* ---------- PinInput ---------- */
export interface PinInputProps extends Pick<FieldProps, 'label' | 'hideLabel' | 'hint' | 'error'> {
  /** Number of boxes. Default 6. */
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called once every box is filled. */
  onComplete?: (value: string) => void;
  /** Default `'numeric'`. */
  type?: 'numeric' | 'alphanumeric';
  /** Hide the characters, like a password. */
  mask?: boolean;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  className?: string;
  fieldClassName?: string;
}

/** Boxes for a one-time code or PIN. Typing moves forward, Backspace moves back, and pasting fills every box. */
export const PinInput = /* @__PURE__ */ React.forwardRef<HTMLDivElement, PinInputProps>(function PinInput(
  {
    label, hideLabel, hint, error, length = 6, value, defaultValue = '', onValueChange, onComplete, type = 'numeric', mask, required, disabled,
    autoFocus, name, id, className, fieldClassName,
  },
  ref,
) {
  const locale = useLocaleOverrides();
  const [rawCode, setRawCode] = useControllableState(value, defaultValue, onValueChange);
  const code = rawCode.slice(0, length);
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);
  const allowed = type === 'numeric' ? /[0-9]/ : /[0-9a-z]/i;

  const commit = (next: string) => {
    setRawCode(next);
    if (next.length === length && !next.includes(' ')) onComplete?.(next);
  };
  const focus = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();
  /** Put `chars` into the boxes from `i` on (a space clears a box), then move focus to `focusTo`. */
  const write = (i: number, chars: string, focusTo: number) => {
    const arr = Array.from({ length }, (_, k) => code[k] ?? ' ');
    for (let k = 0; k < chars.length && i + k < length; k++) arr[i + k] = chars[k]!;
    commit(arr.join('').trimEnd());
    focus(focusTo);
  };
  const clean = (text: string) => [...text].filter((c) => allowed.test(c)).join('');

  return (
    <Field label={label} hideLabel={hideLabel} hint={hint} error={error} required={required} disabled={disabled} id={id} className={fieldClassName}>
      {(ctx) => (
        <div ref={ref} role="group" aria-labelledby={ctx.labelId} aria-describedby={[ctx.hintId, ctx.errorId].filter(Boolean).join(' ') || undefined} className={cx('ui-pin', className)}>
          {Array.from({ length }, (_, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={i === 0 ? ctx.id : undefined}
              className="ui-pin__box"
              type={mask ? 'password' : 'text'}
              inputMode={type === 'numeric' ? 'numeric' : 'text'}
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              // Focus the first box for a code the user just requested, as OS code autofill does.
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={autoFocus && i === 0}
              aria-label={(locale.pinDigit ?? ((n: number, of: number) => `Digit ${n} of ${of}`))(i + 1, length)}
              aria-invalid={ctx.invalid || undefined}
              required={required}
              disabled={disabled}
              maxLength={length}
              value={code[i]?.trim() ?? ''}
              onFocus={(e) => e.currentTarget.select()}
              onChange={(e) => {
                const chars = clean(e.target.value);
                if (!chars) return;
                // One typed character fills this box; a longer value (code autofill) fills from here on.
                const next = chars.length === 2 && code[i]?.trim() ? chars.slice(-1) : chars;
                write(i, next, i + next.length);
              }}
              onPaste={(e) => {
                e.preventDefault();
                const chars = clean(e.clipboardData.getData('text'));
                if (chars) write(i, chars, i + chars.length);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace') {
                  e.preventDefault();
                  if (code[i]?.trim()) write(i, ' ', i);
                  else if (i > 0) write(i - 1, ' ', i - 1);
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  focus(i - 1);
                } else if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  focus(i + 1);
                }
              }}
            />
          ))}
          {name ? <input type="hidden" name={name} value={code.replace(/ /g, '')} /> : null}
        </div>
      )}
    </Field>
  );
});

/* ---------- FileUpload ---------- */
export interface FileUploadProps extends Pick<FieldProps, 'label' | 'hideLabel' | 'hint' | 'error'> {
  /** Accepted types, as for `<input accept>`, e.g. `"image/*,.pdf"`. */
  accept?: string;
  multiple?: boolean;
  /** Largest file in bytes. */
  maxSize?: number;
  maxFiles?: number;
  files?: File[];
  defaultFiles?: File[];
  onFilesChange?: (files: File[]) => void;
  /** Called with the files that were turned away and why. */
  onReject?: (rejections: Array<{ file: File; reason: 'type' | 'size' | 'count' }>) => void;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  fieldClassName?: string;
}

const ratingDefault = (value: number, max: number) => `${value} of ${max} ${max === 1 ? 'star' : 'stars'}`;

const formatBytes = (n: number) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(1)} MB`);

const matchesAccept = (file: File, accept?: string) =>
  !accept ||
  accept.split(',').some((rule) => {
    const r = rule.trim().toLowerCase();
    if (r.startsWith('.')) return file.name.toLowerCase().endsWith(r);
    if (r.endsWith('/*')) return file.type.toLowerCase().startsWith(r.slice(0, -1));
    return file.type.toLowerCase() === r;
  });

/** A drop zone with a browse button and a list of chosen files that can be removed. */
export const FileUpload = /* @__PURE__ */ React.forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload(
  {
    label, hideLabel, hint, error, accept, multiple, maxSize, maxFiles, files, defaultFiles = [], onFilesChange, onReject,
    required, disabled, name, id, className, fieldClassName,
  },
  ref,
) {
  const locale = useLocaleOverrides();
  const [current, commit] = useControllableState<File[]>(files, defaultFiles, onFilesChange);
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const setInputRef = React.useMemo(() => mergeRefs(inputRef, ref), [ref]);

  const add = (incoming: File[]) => {
    const rejected: Array<{ file: File; reason: 'type' | 'size' | 'count' }> = [];
    const ok: File[] = [];
    const limit = multiple ? (maxFiles ?? Infinity) : 1;
    for (const file of incoming) {
      if (!matchesAccept(file, accept)) rejected.push({ file, reason: 'type' });
      else if (maxSize !== undefined && file.size > maxSize) rejected.push({ file, reason: 'size' });
      else if ((multiple ? current.length : 0) + ok.length >= limit) rejected.push({ file, reason: 'count' });
      else ok.push(file);
    }
    if (ok.length) commit(multiple ? [...current, ...ok] : ok);
    if (rejected.length) onReject?.(rejected);
  };

  return (
    <Field label={label} hideLabel={hideLabel} hint={hint} error={error} required={required} disabled={disabled} id={id} className={fieldClassName ?? className}>
      {(ctx) => (
        <div className={cx('ui-upload', fieldClassName && className)}>
          {/* Drop target for pointer users; the browse button is the keyboard path. */}
          { }
          <div
            className="ui-upload__zone"
            data-dragging={dragging || undefined}
            data-invalid={ctx.invalid || undefined}
            data-disabled={disabled || undefined}
            onDragOver={(e) => {
              if (disabled) return;
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              if (!disabled) add([...e.dataTransfer.files]);
            }}
          >
            <UploadIcon size="lg" className="ui-icon ui-upload__icon" />
            <span>
              {locale.dropFiles ?? 'Drop files here or'}{' '}
              <button type="button" className="ui-upload__browse" disabled={disabled} aria-describedby={[ctx.hintId, ctx.errorId].filter(Boolean).join(' ') || undefined} onClick={() => inputRef.current?.click()}>
                {locale.browseFiles ?? 'browse'}
              </button>
            </span>
            <input
              ref={setInputRef}
              id={ctx.id}
              type="file"
              className="ui-visually-hidden"
              tabIndex={-1}
              accept={accept}
              multiple={multiple}
              name={name}
              required={required && current.length === 0}
              disabled={disabled}
              onChange={(e) => {
                add([...(e.target.files ?? [])]);
                e.target.value = '';
              }}
            />
          </div>
          {current.length ? (
            <ul className="ui-upload__list">
              {current.map((file, i) => (
                <li key={`${file.name}-${i}`} className="ui-upload__file">
                  <FileIcon size="sm" />
                  <span className="ui-upload__name">{file.name}</span>
                  <span className="ui-upload__size">{formatBytes(file.size)}</span>
                  <button
                    type="button"
                    className="ui-upload__remove"
                    aria-label={(locale.removeItem ?? ((l: string) => `Remove ${l}`))(file.name)}
                    disabled={disabled}
                    onClick={() => commit(current.filter((_, k) => k !== i))}
                  >
                    <XIcon size="sm" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </Field>
  );
});

/* ---------- Rating ---------- */
export interface RatingProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'defaultValue'> {
  /** Visible label (also the group's accessible name). */
  label: React.ReactNode;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Number of stars. Default 5. */
  max?: number;
  /** Clicking the already-selected star resets the rating to 0. */
  allowClear?: boolean;
  /** Show the value without letting people change it. */
  readOnly?: boolean;
  size?: Size;
  disabled?: boolean;
  name?: string;
}

/** Picks or shows a score out of a few stars. Uses native radio buttons, so arrow keys work. */
export const Rating = /* @__PURE__ */ React.forwardRef<HTMLElement, RatingProps>(function Rating(
  { label, value, defaultValue = 0, onValueChange, max = 5, allowClear, readOnly, size = 'md', disabled, name, className, ...rest },
  ref,
) {
  const locale = useLocaleOverrides();
  const groupName = React.useId();
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange);
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  if (readOnly) {
    return (
      <div ref={ref as React.Ref<HTMLDivElement>} className={cx('ui-rating', className)} data-size={size} data-readonly="" {...rest}>
        <span className="ui-rating__label">{label}</span>
        <span className="ui-rating__stars" role="img" aria-label={(locale.ratingValue ?? ratingDefault)(current, max)}>
          {stars.map((n) => (
            <StarIcon key={n} className="ui-icon ui-rating__star" data-filled={n <= current || undefined} />
          ))}
        </span>
      </div>
    );
  }
  return (
    <fieldset ref={ref as React.Ref<HTMLFieldSetElement>} className={cx('ui-rating', className)} data-size={size} disabled={disabled} {...rest}>
      <legend className="ui-rating__label">{label}</legend>
      <span className="ui-rating__stars">
        {stars.map((n) => (
          <label key={n} className="ui-rating__option" data-filled={n <= current || undefined}>
            <input
              type="radio"
              className="ui-visually-hidden"
              name={name ?? groupName}
              value={n}
              checked={current === n}
              onClick={() => {
                if (allowClear && current === n) setCurrent(0);
              }}
              onChange={() => setCurrent(n)}
            />
            <StarIcon className="ui-icon ui-rating__star" />
            <span className="ui-visually-hidden">{(locale.ratingValue ?? ratingDefault)(n, max)}</span>
          </label>
        ))}
      </span>
    </fieldset>
  );
});
