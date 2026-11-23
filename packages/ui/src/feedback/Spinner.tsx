import * as React from 'react';
import { cx, type Size } from '../utils';
import { useLocale } from '../theme/ThemeProvider';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 16 / 20 / 24 px. Default `'md'`. */
  size?: Size;
  /** Accessible label. Defaults to the locale's "Loading". */
  label?: string;
  /** Hide from screen readers when something else already announces the busy state. */
  decorative?: boolean;
}

/** Shows that something is loading when its duration is unknown. */
export const Spinner = /* @__PURE__ */ React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', label, decorative, className, ...rest },
  ref,
) {
  const locale = useLocale();
  return (
    <span
      ref={ref}
      className={cx('ui-spinner', className)}
      data-size={size}
      role={decorative ? undefined : 'status'}
      aria-hidden={decorative || undefined}
      {...rest}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {decorative ? null : <span className="ui-visually-hidden">{label ?? locale.loading}</span>}
    </span>
  );
});
