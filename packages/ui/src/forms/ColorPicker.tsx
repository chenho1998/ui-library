import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cx, useControllableState, type Size } from '../utils';
import { useLocaleOverrides, usePortalContainer } from '../theme/ThemeProvider';
import { CheckIcon } from '../icons';
import { Field, type FieldProps } from './Field';

const DEFAULT_SWATCHES = [
  '#2c5df5', '#7c3aed', '#db2777', '#e11d48',
  '#ea580c', '#d97706', '#16a34a', '#0d9488',
  '#0284c7', '#18181b', '#6b7280', '#ffffff',
];

function normalizeHex(input: string): string | null {
  const s = input.trim().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/i.test(s)) {
    return `#${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}`.toLowerCase();
  }
  if (/^[0-9a-f]{6}$/i.test(s)) return `#${s.toLowerCase()}`;
  return null;
}

function hexToHsv(hex: string): [number, number, number] {
  const n = normalizeHex(hex) ?? '#2c5df5';
  const r = parseInt(n.slice(1, 3), 16) / 255;
  const g = parseInt(n.slice(3, 5), 16) / 255;
  const b = parseInt(n.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  const s = max === 0 ? 0 : (d / max) * 100;
  return [Math.round(h), Math.round(s), Math.round(max * 100)];
}

function hsvToHex(h: number, s: number, v: number): string {
  const hh = ((h % 360) + 360) % 360;
  const ss = Math.max(0, Math.min(100, s)) / 100;
  const vv = Math.max(0, Math.min(100, v)) / 100;
  const c = vv * ss;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = vv - c;
  const [r1, g1, b1] =
    hh < 60 ? [c, x, 0] : hh < 120 ? [x, c, 0] : hh < 180 ? [0, c, x] : hh < 240 ? [0, x, c] : hh < 300 ? [x, 0, c] : [c, 0, x];
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`;
}

export interface ColorPickerProps extends Pick<FieldProps, 'label' | 'hideLabel' | 'hint' | 'error'> {
  /** Hex colour string, e.g. `"#2c5df5"`. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (hex: string) => void;
  /** Preset swatch colours. Pass `[]` to hide swatches. */
  swatches?: string[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: Size;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  fieldClassName?: string;
}

/** Picks a hex colour from a 2D saturation/brightness area, hue slider, hex input or preset swatches. */
export const ColorPicker = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, ColorPickerProps>(function ColorPicker(
  {
    label, hideLabel, hint, error, value, defaultValue = '#2c5df5', onValueChange, swatches = DEFAULT_SWATCHES,
    open: controlledOpen, defaultOpen = false, onOpenChange, size = 'md', required, disabled, name, id, className, fieldClassName,
  },
  ref,
) {
  const locale = useLocaleOverrides();
  const container = usePortalContainer();
  const [rawValue, setRawValue] = useControllableState(value, defaultValue, onValueChange);
  const current = normalizeHex(rawValue) ?? '#2c5df5';
  const [open, setOpen] = useControllableState(controlledOpen, defaultOpen, onOpenChange);

  // Keep hue stable when saturation or brightness hits 0 so dragging to black/white doesn't snap hue to 0.
  const [hsv, setHsv] = React.useState<[number, number, number]>(() => hexToHsv(current));
  const syncedHex = hsvToHex(hsv[0], hsv[1], hsv[2]);
  const [h, s, v] = syncedHex === current ? hsv : hexToHsv(current);

  const [draft, setDraft] = React.useState<string | null>(null);
  const areaRef = React.useRef<HTMLDivElement>(null);

  const commitHsv = (nh: number, ns: number, nv: number) => {
    const clamped: [number, number, number] = [
      Math.max(0, Math.min(360, Math.round(nh))),
      Math.max(0, Math.min(100, Math.round(ns))),
      Math.max(0, Math.min(100, Math.round(nv))),
    ];
    setHsv(clamped);
    setDraft(null);
    setRawValue(hsvToHex(clamped[0], clamped[1], clamped[2]));
  };

  const commitHex = (hex: string) => {
    const norm = normalizeHex(hex);
    if (!norm) return;
    setHsv(hexToHsv(norm));
    setDraft(null);
    setRawValue(norm);
  };

  const updateFromPointer = (clientX: number, clientY: number) => {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect || !rect.width || !rect.height) return;
    const ns = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const nv = Math.max(0, Math.min(100, (1 - (clientY - rect.top) / rect.height) * 100));
    commitHsv(h, ns, nv);
  };

  const chooseLabel = locale.chooseColor ?? 'Choose colour';

  return (
    <Field label={label} hideLabel={hideLabel} hint={hint} error={error} required={required} disabled={disabled} id={id} className={fieldClassName}>
      {(ctx) => (
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
          <PopoverPrimitive.Trigger asChild>
            <button
              ref={ref}
              type="button"
              id={ctx.id}
              className={cx('ui-input', 'ui-color__trigger', className)}
              data-size={size}
              data-invalid={ctx.invalid || undefined}
              disabled={disabled}
              aria-haspopup="dialog"
              aria-labelledby={label ? `${ctx.labelId} ${ctx.id}` : undefined}
              aria-describedby={[ctx.hintId, ctx.errorId].filter(Boolean).join(' ') || undefined}
            >
              <span className="ui-color__swatch-chip" style={{ background: current }} aria-hidden="true" />
              <span className="ui-color__value">{current.toUpperCase()}</span>
            </button>
          </PopoverPrimitive.Trigger>
          {name ? <input type="hidden" name={name} value={current} /> : null}
          <PopoverPrimitive.Portal container={container}>
            <PopoverPrimitive.Content className="ui-popover ui-color__popover" align="start" sideOffset={4} role="dialog" aria-label={chooseLabel}>
              <div
                ref={areaRef}
                role="slider"
                tabIndex={0}
                aria-label="Saturation and brightness"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={s}
                aria-valuetext={`Saturation ${s}%, brightness ${v}%`}
                className="ui-color__area"
                style={{ backgroundColor: `hsl(${h} 100% 50%)` }}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture?.(e.pointerId);
                  updateFromPointer(e.clientX, e.clientY);
                }}
                onPointerMove={(e) => {
                  if (e.buttons & 1) updateFromPointer(e.clientX, e.clientY);
                }}
                onKeyDown={(e) => {
                  const step = e.shiftKey ? 10 : 2;
                  if (e.key === 'ArrowRight') { e.preventDefault(); commitHsv(h, s + step, v); }
                  else if (e.key === 'ArrowLeft') { e.preventDefault(); commitHsv(h, s - step, v); }
                  else if (e.key === 'ArrowUp') { e.preventDefault(); commitHsv(h, s, v + step); }
                  else if (e.key === 'ArrowDown') { e.preventDefault(); commitHsv(h, s, v - step); }
                }}
              >
                <span className="ui-color__thumb" style={{ left: `${s}%`, top: `${100 - v}%`, background: current }} />
              </div>

              <label className="ui-color__hue-row">
                <span className="ui-visually-hidden">{locale.hue ?? 'Hue'}</span>
                <input
                  type="range"
                  className="ui-color__hue"
                  min={0}
                  max={360}
                  value={h}
                  aria-label={locale.hue ?? 'Hue'}
                  onChange={(e) => commitHsv(Number(e.target.value), s, v)}
                />
              </label>

              <div className="ui-color__hex-row">
                <span className="ui-color__swatch-chip" style={{ background: current }} aria-hidden="true" />
                <input
                  type="text"
                  className="ui-color__hex"
                  aria-label={locale.colorHex ?? 'Hex colour'}
                  value={draft ?? current.toUpperCase()}
                  spellCheck={false}
                  onChange={(e) => {
                    const next = e.target.value;
                    setDraft(next);
                    const norm = normalizeHex(next);
                    if (norm) {
                      setHsv(hexToHsv(norm));
                      setRawValue(norm);
                    }
                  }}
                  onBlur={() => setDraft(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && draft !== null) {
                      commitHex(draft);
                      setDraft(null);
                    }
                  }}
                />
              </div>

              {swatches.length ? (
                <div className="ui-color__swatches" role="group" aria-label="Preset colours">
                  {swatches.map((hex) => {
                    const norm = normalizeHex(hex) ?? hex;
                    const active = norm === current;
                    return (
                      <button
                        key={hex}
                        type="button"
                        className="ui-color__swatch"
                        style={{ background: norm }}
                        aria-label={norm.toUpperCase()}
                        aria-pressed={active}
                        data-active={active || undefined}
                        onClick={() => commitHex(norm)}
                      >
                        {active ? <CheckIcon size={12} strokeWidth={3} /> : null}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      )}
    </Field>
  );
});
