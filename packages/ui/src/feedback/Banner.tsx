import * as React from 'react';
import { cx } from '../utils';
import { useLocaleOverrides } from '../theme/ThemeProvider';
import { DangerIcon, InfoIcon, SuccessIcon, WarningIcon, XIcon } from '../icons';

type BannerTone = 'info' | 'success' | 'warning' | 'danger' | 'accent';

const toneIcon: Record<BannerTone, React.ReactNode> = {
  info: <InfoIcon size="sm" />,
  success: <SuccessIcon size="sm" />,
  warning: <WarningIcon size="sm" />,
  danger: <DangerIcon size="sm" />,
  accent: <InfoIcon size="sm" />,
};

export interface BannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Colour meaning. Default `'info'`. */
  tone?: BannerTone;
  /** `subtle` uses a tinted background; `solid` uses a strong fill. Default `'subtle'`. */
  variant?: 'subtle' | 'solid';
  /** Optional short lead-in text before the message. */
  title?: React.ReactNode;
  /** Replace the tone's default icon, or pass `null` for none. */
  icon?: React.ReactNode;
  /** Inline action button or link placed at the end of the banner. */
  action?: React.ReactNode;
  /** Shows a dismiss button and calls this handler when clicked. */
  onDismiss?: () => void;
  /** Stick to the top of the viewport or scroll container. */
  sticky?: boolean;
  /** Announce immediately to screen readers (uses `role="alert"` for danger, `role="status"` otherwise). */
  live?: boolean;
}

/** A full-width announcement strip for page- or app-level messages, maintenance notices or promotions. */
export const Banner = /* @__PURE__ */ React.forwardRef<HTMLDivElement, BannerProps>(function Banner(
  {
    tone = 'info',
    variant = 'subtle',
    title,
    icon,
    action,
    onDismiss,
    sticky,
    live,
    className,
    children,
    role,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const locale = useLocaleOverrides();
  const computedRole = role ?? (live ? (tone === 'danger' ? 'alert' : 'status') : ariaLabel ? 'region' : undefined);
  return (
    <div
      ref={ref}
      role={computedRole}
      aria-label={ariaLabel}
      className={cx('ui-banner', className)}
      data-tone={tone}
      data-variant={variant}
      data-sticky={sticky || undefined}
      {...rest}
    >
      <div className="ui-banner__inner">
        {icon === null ? null : <span className="ui-banner__icon">{icon ?? toneIcon[tone]}</span>}
        <div className="ui-banner__content">
          {title ? <strong className="ui-banner__title">{title}</strong> : null}
          {children ? <span className="ui-banner__text">{children}</span> : null}
        </div>
        {action ? <div className="ui-banner__action">{action}</div> : null}
        {onDismiss ? (
          <button type="button" className="ui-banner__close" aria-label={locale.dismiss ?? 'Dismiss'} onClick={onDismiss}>
            <XIcon size="sm" />
          </button>
        ) : null}
      </div>
    </div>
  );
});
