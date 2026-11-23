import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cx } from '../utils';

export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
const space = (s?: Space) => (s === undefined ? undefined : `var(--ui-space-${s})`);

/* ---------- Box ---------- */
export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render the child element instead of a div. */
  asChild?: boolean;
  /** Padding on all sides, as a space token. */
  p?: Space;
  /** Horizontal padding. */
  px?: Space;
  /** Vertical padding. */
  py?: Space;
}

/** The lowest-level layout primitive: a div with token-based padding. */
export const Box = /* @__PURE__ */ React.forwardRef<HTMLDivElement, BoxProps>(function Box(
  { asChild, p, px, py, style, className, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cx('ui-box', className)}
      style={{
        padding: space(p),
        paddingInline: space(px),
        paddingBlock: space(py),
        ...style,
      }}
      {...rest}
    />
  );
});

/* ---------- Stack ---------- */
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Main axis. Default `'column'`. */
  direction?: 'row' | 'column';
  /** Gap between children, as a space token. Default `3` (12 px). */
  gap?: Space;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
  asChild?: boolean;
}

/** Lays children out in a row or column with even spacing. */
export const Stack = /* @__PURE__ */ React.forwardRef<HTMLDivElement, StackProps>(function Stack(
  { direction = 'column', gap = 3, align, justify, wrap, asChild, style, className, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : 'div';
  const jmap = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between' } as const;
  const amap = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch', baseline: 'baseline' } as const;
  return (
    <Comp
      ref={ref}
      className={cx('ui-stack', className)}
      data-direction={direction}
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: space(gap),
        alignItems: align ? amap[align] : undefined,
        justifyContent: justify ? jmap[justify] : undefined,
        flexWrap: wrap ? 'wrap' : undefined,
        ...style,
      }}
      {...rest}
    />
  );
});

/* ---------- Grid ---------- */
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fixed number of equal columns. */
  columns?: number;
  /** Responsive alternative to `columns`: as many columns as fit at this minimum width. */
  minChildWidth?: string;
  gap?: Space;
}

/** CSS grid with token gaps. */
export const Grid = /* @__PURE__ */ React.forwardRef<HTMLDivElement, GridProps>(function Grid(
  { columns, minChildWidth, gap = 4, style, className, ...rest },
  ref,
) {
  const template = minChildWidth
    ? `repeat(auto-fill, minmax(min(${minChildWidth}, 100%), 1fr))`
    : `repeat(${columns ?? 1}, minmax(0, 1fr))`;
  return (
    <div
      ref={ref}
      className={cx('ui-grid', className)}
      style={{ display: 'grid', gridTemplateColumns: template, gap: space(gap), ...style }}
      {...rest}
    />
  );
});

/* ---------- Container ---------- */
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max width: sm 640 · md 768 · lg 1024 · xl 1280. Default `'lg'`. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/** Centres content with a max width and side padding. */
export const Container = /* @__PURE__ */ React.forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { size = 'lg', className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('ui-container', className)} data-size={size} {...rest} />;
});

/* ---------- Divider ---------- */
export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Purely visual divider, hidden from assistive technology. Default `true`. */
  decorative?: boolean;
}

export const Divider = /* @__PURE__ */ React.forwardRef<HTMLHRElement, DividerProps>(function Divider(
  { orientation = 'horizontal', decorative = true, className, ...rest },
  ref,
) {
  return (
    <hr
      ref={ref}
      className={cx('ui-divider', className)}
      data-orientation={orientation}
      aria-hidden={decorative || undefined}
      aria-orientation={!decorative && orientation === 'vertical' ? 'vertical' : undefined}
      {...rest}
    />
  );
});

/* ---------- Text ---------- */
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div' | 'label' | 'strong' | 'em' | 'small' | 'code';
  size?: TextSize;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  tone?: 'primary' | 'secondary' | 'disabled' | 'accent' | 'success' | 'warning' | 'danger';
  /** Cut overflowing text with an ellipsis on one line. */
  truncate?: boolean;
  align?: 'start' | 'center' | 'end';
}

/** Body text bound to the type scale. */
export const Text = /* @__PURE__ */ React.forwardRef<HTMLElement, TextProps>(function Text(
  { as: Comp = 'p', size, weight, tone, truncate, align, className, ...rest },
  ref,
) {
  return (
    <Comp
      ref={ref as React.Ref<never>}
      className={cx('ui-text', className)}
      data-size={size}
      data-weight={weight}
      data-tone={tone}
      data-truncate={truncate || undefined}
      data-align={align}
      {...rest}
    />
  );
});

/* ---------- Heading ---------- */
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Semantic level (h1–h6). Default 2. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual size, independent of level. Defaults by level. */
  size?: TextSize;
}

const headingSize: Record<number, TextSize> = { 1: '3xl', 2: '2xl', 3: 'xl', 4: 'lg', 5: 'md', 6: 'sm' };

export const Heading = /* @__PURE__ */ React.forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level = 2, size, className, ...rest },
  ref,
) {
  const Comp = `h${level}` as 'h2';
  return <Comp ref={ref} className={cx('ui-heading', className)} data-size={size ?? headingSize[level]} {...rest} />;
});

/* ---------- VisuallyHidden ---------- */
/** Hides content visually while keeping it available to screen readers. */
export const VisuallyHidden = /* @__PURE__ */ React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  function VisuallyHidden({ className, ...rest }, ref) {
    return <span ref={ref} className={cx('ui-visually-hidden', className)} {...rest} />;
  },
);
