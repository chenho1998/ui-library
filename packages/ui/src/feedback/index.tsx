import * as React from 'react';
import { cx, type Size } from '../utils';
import { useLocaleOverrides } from '../theme/ThemeProvider';
import { DangerIcon, InfoIcon, SuccessIcon, WarningIcon, XIcon } from '../icons';

export { Spinner, type SpinnerProps } from './Spinner';

type StatusTone = 'info' | 'success' | 'warning' | 'danger';
const toneIcon: Record<StatusTone, React.ReactNode> = {
  info: <InfoIcon size="md" />,
  success: <SuccessIcon size="md" />,
  warning: <WarningIcon size="md" />,
  danger: <DangerIcon size="md" />,
};

/* ---------- Alert ---------- */
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Default `'info'`. */
  tone?: StatusTone;
  title?: React.ReactNode;
  /** Replace the tone's default icon, or pass `null` for none. */
  icon?: React.ReactNode;
  /** Optional actions (buttons or links) under the message. */
  actions?: React.ReactNode;
  /** Shows a close button. */
  onDismiss?: () => void;
  /** Announce immediately to screen readers (use for alerts that appear after an action). */
  live?: boolean;
}

/** A persistent message about the state of a page or section. */
export const Alert = /* @__PURE__ */ React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = 'info', title, icon, actions, onDismiss, live, className, children, ...rest },
  ref,
) {
  const locale = useLocaleOverrides();
  return (
    <div ref={ref} role={live ? 'alert' : undefined} className={cx('ui-alert', className)} data-tone={tone} {...rest}>
      {icon === null ? null : <span className="ui-alert__icon">{icon ?? toneIcon[tone]}</span>}
      <div className="ui-alert__body">
        {title ? <p className="ui-alert__title">{title}</p> : null}
        {children ? <div className="ui-alert__content">{children}</div> : null}
        {actions ? <div className="ui-alert__actions">{actions}</div> : null}
      </div>
      {onDismiss ? (
        <button type="button" className="ui-alert__close" aria-label={locale.dismiss ?? 'Dismiss'} onClick={onDismiss}>
          <XIcon size="sm" />
        </button>
      ) : null}
    </div>
  );
});

/* ---------- Progress ---------- */
export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Current value; `null` shows an indeterminate bar. */
  value?: number | null;
  max?: number;
  /** Visible label above the bar (also its accessible name). */
  label?: React.ReactNode;
  /** Show the percentage beside the label. */
  showValue?: boolean;
  /** Bar thickness: 4 / 8 / 12 px. Default `'md'`. */
  size?: Size;
  tone?: 'accent' | 'success' | 'warning' | 'danger';
}

/** Shows how far a task has progressed. */
export const Progress = /* @__PURE__ */ React.forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value = null, max = 100, label, showValue, size = 'md', tone = 'accent', className, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const id = React.useId();
  const safeMax = max > 0 ? max : 100;
  const clamped = value === null ? null : Math.min(safeMax, Math.max(0, value));
  const pct = clamped === null ? null : Math.round((clamped / safeMax) * 100);
  const state = pct === null ? 'indeterminate' : clamped === safeMax ? 'complete' : 'loading';
  return (
    <div ref={ref} className={cx('ui-progress', className)} data-size={size} data-tone={tone} {...rest}>
      {label || showValue ? (
        <div className="ui-progress__header">
          {label ? <span id={`${id}-label`}>{label}</span> : <span />}
          {showValue && pct !== null ? <span className="ui-progress__value">{pct}%</span> : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        className="ui-progress__track"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={clamped ?? undefined}
        aria-valuetext={pct === null ? undefined : `${pct}%`}
        aria-label={ariaLabel}
        aria-labelledby={label ? `${id}-label` : undefined}
        data-state={state}
        data-value={clamped ?? undefined}
        data-max={safeMax}
      >
        <div
          className="ui-progress__bar"
          data-state={state}
          data-indeterminate={pct === null || undefined}
          style={pct === null ? undefined : { transform: `translateX(-${100 - pct}%)` }}
        />
      </div>
    </div>
  );
});

/* ---------- Skeleton ---------- */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Default `'text'`. */
  shape?: 'text' | 'rect' | 'circle';
  width?: number | string;
  height?: number | string;
  /** For `text`: number of lines; the last is shorter. */
  lines?: number;
}

/** A placeholder shown while content loads, shaped like what will replace it. */
export const Skeleton = /* @__PURE__ */ React.forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { shape = 'text', width, height, lines = 1, className, style, ...rest },
  ref,
) {
  if (shape === 'text' && lines > 1) {
    return (
      <div ref={ref} className={cx('ui-skeleton-group', className)} aria-hidden="true" style={{ width, ...style }} {...rest}>
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className="ui-skeleton" data-shape="text" style={i === lines - 1 ? { width: '60%' } : undefined} />
        ))}
      </div>
    );
  }
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cx('ui-skeleton', className)}
      data-shape={shape}
      style={{ width, height: shape === 'circle' ? (height ?? width) : height, ...style }}
      {...rest}
    />
  );
});

/* ---------- Toast ---------- */
export interface ToastOptions {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Default `'info'`. Danger toasts stay until dismissed. */
  tone?: StatusTone;
  /** One action. Never make a toast the only way to reach it. */
  action?: { label: string; onClick: () => void };
  /** Milliseconds on screen. Default 5000; `Infinity` keeps it until dismissed. */
  duration?: number;
  id?: string;
}

interface ToastRecord extends Required<Pick<ToastOptions, 'title' | 'tone' | 'duration'>> {
  id: string;
  description?: React.ReactNode;
  action?: ToastOptions['action'];
}

let toasts: ToastRecord[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
let toastCount = 0;

function showToast(options: ToastOptions): string {
  const id = options.id ?? `toast-${++toastCount}`;
  const tone = options.tone ?? 'info';
  const record: ToastRecord = {
    id,
    title: options.title,
    description: options.description,
    tone,
    action: options.action,
    duration: options.duration ?? (tone === 'danger' ? Infinity : 5000),
  };
  toasts = [record, ...toasts.filter((t) => t.id !== id)];
  emit();
  return id;
}
function dismissToast(id?: string) {
  toasts = id ? toasts.filter((t) => t.id !== id) : [];
  emit();
}

export interface ToastPromiseMessages<T> {
  loading: React.ReactNode;
  success: React.ReactNode | ((data: T) => React.ReactNode);
  error: React.ReactNode | ((err: unknown) => React.ReactNode);
}

function promiseToast<T>(promise: Promise<T>, messages: ToastPromiseMessages<T>): Promise<T> {
  const id = showToast({ title: messages.loading, tone: 'info', duration: Infinity });
  promise.then(
    (data) => {
      const title = typeof messages.success === 'function' ? messages.success(data) : messages.success;
      showToast({ id, title, tone: 'success' });
    },
    (err) => {
      const title = typeof messages.error === 'function' ? messages.error(err) : messages.error;
      showToast({ id, title, tone: 'danger' });
    },
  );
  return promise;
}

/**
 * Show a toast from anywhere. Returns its id. Needs one `<Toaster />` mounted.
 * `toast.info()`, `toast.success()`, `toast.warning()`, `toast.error()`, `toast.promise()` and `toast.dismiss(id?)` are shortcuts.
 */
export const toast = /* @__PURE__ */ Object.assign(showToast, {
  dismiss: dismissToast,
  info: (title: React.ReactNode, opts: Omit<ToastOptions, 'title' | 'tone'> = {}) => showToast({ ...opts, title, tone: 'info' }),
  success: (title: React.ReactNode, opts: Omit<ToastOptions, 'title' | 'tone'> = {}) => showToast({ ...opts, title, tone: 'success' }),
  warning: (title: React.ReactNode, opts: Omit<ToastOptions, 'title' | 'tone'> = {}) => showToast({ ...opts, title, tone: 'warning' }),
  error: (title: React.ReactNode, opts: Omit<ToastOptions, 'title' | 'tone'> = {}) => showToast({ ...opts, title, tone: 'danger' }),
  promise: promiseToast,
});

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => toasts;

export interface ToasterProps {
  /** Default `'bottom-right'`. */
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  /** Most toasts visible at once. Default 3. */
  max?: number;
  /** Keyboard shortcut that moves focus to the toasts. Default F8. */
  hotkey?: string;
}

/** Renders the toast queue. Mount once, inside `ThemeProvider`. */
export function Toaster({ position = 'bottom-right', max = 3, hotkey = 'F8' }: ToasterProps) {
  const list = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const locale = useLocaleOverrides();
  const regionRef = React.useRef<HTMLOListElement>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === hotkey) {
        const first = regionRef.current?.querySelector<HTMLElement>('.ui-toast');
        first?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkey]);

  return (
    <section aria-label={`${locale.notifications ?? 'Notifications'} (${hotkey})`} className="ui-toaster" data-position={position}>
      <ol ref={regionRef} className="ui-toaster__list" aria-live="polite" aria-relevant="additions">
        {list.slice(0, max).map((t) => (
          <ToastItem key={t.id} record={t} position={position} />
        ))}
      </ol>
    </section>
  );
}

const SWIPE_START = 6; // px of horizontal movement before a drag counts as a swipe
const SWIPE_DISMISS = 80; // px
const SWIPE_FLICK = 0.5; // px per ms
const EXIT_MS = 200;

function ToastItem({ record, position }: { record: ToastRecord; position: NonNullable<ToasterProps['position']> }) {
  const locale = useLocaleOverrides();
  const [paused, setPaused] = React.useState(false);
  const [dx, setDx] = React.useState<number | null>(null); // horizontal offset while dragging
  const [leaving, setLeaving] = React.useState<-1 | 0 | 1>(0); // exit direction once dismissed by swipe
  const gesture = React.useRef<{ x: number; y: number; t: number; swiping: boolean } | null>(null);
  const remaining = React.useRef(record.duration);
  const since = React.useRef(0); // set when the timer starts
  const held = paused || dx !== null || leaving !== 0;

  // Toasts swipe away towards the screen edge they sit on; centred toasts go either way.
  const allowed = (d: number) => (position.endsWith('right') ? d > 0 : position.endsWith('left') ? d < 0 : true);
  // Dragging the "wrong" way moves a little, with resistance, so it still feels responsive.
  const resist = (d: number) => (allowed(d) ? d : Math.sign(d) * Math.min(Math.abs(d) / 4, 16));

  React.useEffect(() => {
    if (held || !Number.isFinite(remaining.current)) return;
    since.current = Date.now();
    const timer = window.setTimeout(() => dismissToast(record.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - since.current;
    };
  }, [held, record.id]);

  React.useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(() => dismissToast(record.id), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [leaving, record.id]);

  const endGesture = () => {
    gesture.current = null;
    setDx(null);
  };

  const style: React.CSSProperties | undefined = leaving
    ? { transform: `translateX(${leaving * 110}%)`, opacity: 0 }
    : dx !== null
      ? { transform: `translateX(${dx}px)`, opacity: Math.max(0.25, 1 - Math.abs(dx) / 240) }
      : undefined;

  return (
    // Focusable live region item: F8 focuses it, Escape dismisses it and pointer swipes dismiss it.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      className="ui-toast"
      data-tone={record.tone}
      data-swiping={dx !== null || undefined}
      tabIndex={0}
      role={record.tone === 'danger' ? 'alert' : 'status'}
      aria-atomic="true"
      style={style}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') toast.dismiss(record.id);
      }}
      onPointerDown={(e) => {
        // Leave clicks on the action and close buttons alone.
        if (e.button !== 0 || leaving || (e.target as HTMLElement).closest('button, a')) return;
        gesture.current = { x: e.clientX, y: e.clientY, t: e.timeStamp, swiping: false };
      }}
      onPointerMove={(e) => {
        const g = gesture.current;
        if (!g) return;
        const moveX = e.clientX - g.x;
        const moveY = e.clientY - g.y;
        if (!g.swiping) {
          if (Math.abs(moveX) > SWIPE_START && Math.abs(moveX) > Math.abs(moveY)) {
            g.swiping = true;
            e.currentTarget.setPointerCapture?.(e.pointerId);
          } else if (Math.abs(moveY) > SWIPE_START) {
            gesture.current = null; // vertical: let the page scroll
          }
          return;
        }
        setDx(resist(moveX));
      }}
      onPointerUp={(e) => {
        const g = gesture.current;
        if (g?.swiping) {
          const moveX = e.clientX - g.x;
          const speed = Math.abs(moveX) / Math.max(1, e.timeStamp - g.t);
          if (allowed(moveX) && (Math.abs(moveX) > SWIPE_DISMISS || (speed > SWIPE_FLICK && Math.abs(moveX) > 2 * SWIPE_START))) {
            setLeaving(moveX > 0 ? 1 : -1);
          }
        }
        endGesture();
      }}
      onPointerCancel={endGesture}
    >
      <span className="ui-toast__icon">{toneIcon[record.tone]}</span>
      <div className="ui-toast__body">
        <p className="ui-toast__title">{record.title}</p>
        {record.description ? <p className="ui-toast__description">{record.description}</p> : null}
        {record.action ? (
          <button
            type="button"
            className="ui-toast__action"
            onClick={() => {
              record.action?.onClick();
              toast.dismiss(record.id);
            }}
          >
            {record.action.label}
          </button>
        ) : null}
      </div>
      <button type="button" className="ui-toast__close" aria-label={locale.dismiss ?? 'Dismiss'} onClick={() => toast.dismiss(record.id)}>
        <XIcon size="sm" />
      </button>
    </li>
  );
}
