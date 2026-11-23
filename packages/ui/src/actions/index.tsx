import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cx, type Size } from '../utils';
import { Spinner } from '../feedback/Spinner';

/* ---------- Button ---------- */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Default `'solid'`. */
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  /** Colour meaning. Default `'accent'`. */
  tone?: 'accent' | 'neutral' | 'danger';
  /** Height 32 / 40 / 48 px. Default `'md'`. */
  size?: Size;
  /** Shows a spinner, sets `aria-busy` and ignores clicks. Keeps the button's width. */
  loading?: boolean;
  /** Stretch to the container's width. */
  fullWidth?: boolean;
  /** Icon before the label. */
  startIcon?: React.ReactNode;
  /** Icon after the label. */
  endIcon?: React.ReactNode;
  /** Render the child element (e.g. a router link) with button styles. */
  asChild?: boolean;
}

/** Triggers an action. For navigation use `Link`; for icon-only buttons use `IconButton`. */
export const Button = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'solid',
    tone = 'accent',
    size = 'md',
    loading = false,
    fullWidth,
    startIcon,
    endIcon,
    asChild,
    disabled,
    type,
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : (type ?? 'button')}
      className={cx('ui-button', className)}
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-loading={loading || undefined}
      data-full-width={fullWidth || undefined}
      disabled={asChild ? undefined : disabled}
      aria-disabled={asChild && disabled ? true : undefined}
      aria-busy={loading || undefined}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (loading) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
      {...rest}
    >
      {loading ? <Spinner size="sm" decorative className="ui-button__spinner" /> : startIcon}
      <Slottable>{children}</Slottable>
      {endIcon}
    </Comp>
  );
});

/* ---------- IconButton ---------- */
export interface IconButtonProps extends Omit<ButtonProps, 'startIcon' | 'endIcon' | 'fullWidth' | 'children'> {
  /** Required accessible name, since the button has no visible text. */
  'aria-label': string;
  /** The icon. */
  children: React.ReactNode;
}

/** A square button that holds only an icon. */
export const IconButton = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'ghost', tone = 'neutral', className, ...rest },
  ref,
) {
  return <Button ref={ref} variant={variant} tone={tone} className={cx('ui-icon-button', className)} {...rest} />;
});

/* ---------- ButtonGroup ---------- */
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Join the buttons into one control with shared borders. Default `false` (spaced). */
  attached?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

/** Groups related buttons. Give it an `aria-label` when the group needs a name. */
export const ButtonGroup = /* @__PURE__ */ React.forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { attached = false, orientation = 'horizontal', className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      className={cx('ui-button-group', className)}
      data-attached={attached || undefined}
      data-orientation={orientation}
      {...rest}
    />
  );
});

/* ---------- Link ---------- */
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** `inline` is underlined inside text; `standalone` is underlined on hover. Default `'inline'`. */
  variant?: 'inline' | 'standalone';
  /** Opens in a new tab with safe `rel` and an announcement for screen readers. */
  external?: boolean;
  /** Render a router link (e.g. Next.js `Link`) with these styles. */
  asChild?: boolean;
}

/** Navigates to another page or place. */
export const Link = /* @__PURE__ */ React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { variant = 'inline', external, asChild, className, children, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : 'a';
  return (
    <Comp
      ref={ref}
      className={cx('ui-link', className)}
      data-variant={variant}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      <Slottable>{children}</Slottable>
      {external ? <span className="ui-visually-hidden"> (opens in a new tab)</span> : null}
    </Comp>
  );
});
