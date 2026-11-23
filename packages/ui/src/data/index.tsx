import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Slot } from '@radix-ui/react-slot';
import { cx, type Size } from '../utils';
import { useLocale } from '../theme/ThemeProvider';
import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon, InboxIcon, XIcon } from '../icons';
import { Checkbox } from '../forms';
import { Skeleton } from '../feedback';

/* ---------- Card ---------- */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Default `'outline'`. */
  variant?: 'outline' | 'elevated' | 'subtle';
  /** Inner padding as a size. Default `'md'` (24 px). */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Render the child (e.g. a link) as the card, with hover styles. */
  asChild?: boolean;
  /** Adds hover and focus styles for clickable cards. */
  interactive?: boolean;
}

const CardRoot = /* @__PURE__ */ React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'outline', padding = 'md', asChild, interactive, className, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cx('ui-card', className)}
      data-variant={variant}
      data-padding={padding}
      data-interactive={interactive || asChild || undefined}
      {...rest}
    />
  );
});

const part = (cls: string) =>
  /* @__PURE__ */ React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardPart({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(cls, className)} {...rest} />;
  });
const CardTitle = /* @__PURE__ */ React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement> & { level?: 2 | 3 | 4 }>(
  function CardTitle({ level = 3, className, ...rest }, ref) {
    const H = `h${level}` as 'h3';
    return <H ref={ref} className={cx('ui-card__title', className)} {...rest} />;
  },
);

/** Groups related content and actions about one subject. */
export const Card = /* @__PURE__ */ Object.assign(CardRoot, {
  Header: /* @__PURE__ */ part('ui-card__header'),
  Title: CardTitle,
  Description: /* @__PURE__ */ React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(function CardDescription({ className, ...rest }, ref) {
    return <p ref={ref} className={cx('ui-card__description', className)} {...rest} />;
  }),
  Body: /* @__PURE__ */ part('ui-card__body'),
  Footer: /* @__PURE__ */ part('ui-card__footer'),
});

/* ---------- Avatar ---------- */
export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string;
  /** Person or entity name: used for alt text and initials. */
  name: string;
  /** 24 / 32 / 40 / 56 px. Default `'md'`. */
  size?: 'xs' | Size;
  shape?: 'circle' | 'square';
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

/** A picture of a person or entity, falling back to initials. */
export const Avatar = /* @__PURE__ */ React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name, size = 'md', shape = 'circle', className, ...rest },
  ref,
) {
  return (
    <AvatarPrimitive.Root ref={ref} className={cx('ui-avatar', className)} data-size={size} data-shape={shape} {...rest}>
      {src ? <AvatarPrimitive.Image className="ui-avatar__image" src={src} alt={name} /> : null}
      <AvatarPrimitive.Fallback className="ui-avatar__fallback" delayMs={src ? 300 : 0}>
        <span aria-hidden="true">{initials(name)}</span>
        <span className="ui-visually-hidden">{name}</span>
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
});

/* ---------- Badge ---------- */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
  /** `subtle` (tinted) or `solid`. Default `'subtle'`. */
  variant?: 'subtle' | 'solid' | 'outline';
  size?: 'sm' | 'md';
}

/** A short status label or count. Not interactive. */
export const Badge = /* @__PURE__ */ React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', variant = 'subtle', size = 'md', className, ...rest },
  ref,
) {
  return <span ref={ref} className={cx('ui-badge', className)} data-tone={tone} data-variant={variant} data-size={size} {...rest} />;
});

/* ---------- Tag ---------- */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeProps['tone'];
  /** Shows a remove button. */
  onRemove?: () => void;
  /** Accessible label for the remove button. Default: the locale's `removeItem(children)` if children is a string. */
  removeLabel?: string;
  disabled?: boolean;
}

/** A keyword or filter value that the user can often remove. */
export const Tag = /* @__PURE__ */ React.forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { tone = 'neutral', onRemove, removeLabel, disabled, className, children, ...rest },
  ref,
) {
  const locale = useLocale();
  const label = removeLabel ?? (typeof children === 'string' ? locale.removeItem(children) : locale.dismiss);
  return (
    <span ref={ref} className={cx('ui-tag', className)} data-tone={tone} data-disabled={disabled || undefined} {...rest}>
      <span className="ui-tag__label">{children}</span>
      {onRemove ? (
        <button type="button" className="ui-tag__remove" aria-label={label} disabled={disabled} onClick={onRemove}>
          <XIcon size={12} strokeWidth={2.5} />
        </button>
      ) : null}
    </span>
  );
});

/* ---------- Accordion ---------- */
type AccordionRootProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>;

const AccordionRoot = /* @__PURE__ */ React.forwardRef<HTMLDivElement, AccordionRootProps>(function Accordion({ className, ...rest }, ref) {
  return <AccordionPrimitive.Root ref={ref} className={cx('ui-accordion', className)} {...(rest as AccordionRootProps)} />;
});

export interface AccordionItemProps extends Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>, 'title'> {
  /** Header text. */
  title: React.ReactNode;
  /** Heading level for the header. Default 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

const AccordionItem = /* @__PURE__ */ React.forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { title, headingLevel = 3, className, children, ...rest },
  ref,
) {
  const H = `h${headingLevel}` as 'h3';
  return (
    <AccordionPrimitive.Item ref={ref} className={cx('ui-accordion__item', className)} {...rest}>
      <AccordionPrimitive.Header asChild>
        <H className="ui-accordion__header">
          <AccordionPrimitive.Trigger className="ui-accordion__trigger">
            <span>{title}</span>
            <ChevronDownIcon size="sm" className="ui-icon ui-accordion__chevron" />
          </AccordionPrimitive.Trigger>
        </H>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="ui-accordion__content">
        <div className="ui-accordion__content-inner">{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
});

/**
 * Stacked sections that expand to show more.
 * `<Accordion type="single" collapsible><Accordion.Item value="a" title="…">…</Accordion.Item></Accordion>`
 */
export const Accordion = /* @__PURE__ */ Object.assign(AccordionRoot, { Item: AccordionItem });

/* ---------- EmptyState ---------- */
export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Icon or illustration. Default: an inbox icon. */
  icon?: React.ReactNode;
  /** Primary next step, usually a Button. */
  action?: React.ReactNode;
}

/** Explains why there is nothing here and what to do next. */
export const EmptyState = /* @__PURE__ */ React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { title, description, icon, action, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('ui-empty', className)} {...rest}>
      <div className="ui-empty__icon" aria-hidden="true">
        {icon ?? <InboxIcon size={32} strokeWidth={1.5} />}
      </div>
      <p className="ui-empty__title">{title}</p>
      {description ? <p className="ui-empty__description">{description}</p> : null}
      {action ? <div className="ui-empty__action">{action}</div> : null}
    </div>
  );
});

/* ---------- Table ---------- */
export interface TableColumn<T> {
  key: string;
  header: React.ReactNode;
  /** Cell renderer. Default: `row[key]`. */
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'start' | 'center' | 'end';
  width?: number | string;
}

export interface TableSort {
  key: string;
  direction: 'asc' | 'desc';
}

export interface TableProps<T> extends Omit<React.TableHTMLAttributes<HTMLTableElement>, 'children'> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  /** Required accessible caption; hide it visually with `hideCaption`. */
  caption: string;
  hideCaption?: boolean;
  sort?: TableSort | null;
  onSortChange?: (sort: TableSort | null) => void;
  /** Selected row keys. Passing this adds a checkbox column. */
  selection?: Set<string>;
  onSelectionChange?: (selection: Set<string>) => void;
  /** Name of each row for screen readers, used in "Select <name>". Default: its key. */
  rowLabel?: (row: T) => string;
  /** Row height 36 / 48 px. Default `'default'`. */
  density?: 'compact' | 'default';
  stickyHeader?: boolean;
  loading?: boolean;
  /** Shown when `data` is empty and not loading. */
  emptyState?: React.ReactNode;
  onRowClick?: (row: T) => void;
}

/** Shows rows of records with optional sorting and selection. For huge or editable data, use a data grid. */
export function Table<T>({
  columns, data, rowKey, caption, hideCaption, sort, onSortChange, selection, onSelectionChange, rowLabel,
  density = 'default', stickyHeader, loading, emptyState, onRowClick, className, ...rest
}: TableProps<T>) {
  const locale = useLocale();
  const selectable = selection !== undefined;
  const keys = data.map(rowKey);
  const selectedCount = selectable ? keys.filter((k) => selection.has(k)).length : 0;
  const allState: boolean | 'indeterminate' =
    selectedCount === 0 ? false : selectedCount === keys.length ? true : 'indeterminate';
  const colCount = columns.length + (selectable ? 1 : 0);

  const toggleSort = (key: string) => {
    if (!onSortChange) return;
    if (!sort || sort.key !== key) onSortChange({ key, direction: 'asc' });
    else if (sort.direction === 'asc') onSortChange({ key, direction: 'desc' });
    else onSortChange(null);
  };
  const toggleRow = (key: string) => {
    if (!selection || !onSelectionChange) return;
    const next = new Set(selection);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectionChange(next);
  };

  return (
    <div className="ui-table-wrap" data-sticky={stickyHeader || undefined}>
      <table className={cx('ui-table', className)} data-density={density} aria-busy={loading || undefined} {...rest}>
        <caption className={hideCaption ? 'ui-visually-hidden' : 'ui-table__caption'}>{caption}</caption>
        <thead>
          <tr>
            {selectable ? (
              <th scope="col" className="ui-table__select">
                <Checkbox
                  aria-label={locale.selectAll}
                  checked={allState}
                  disabled={!keys.length}
                  onCheckedChange={() => onSelectionChange?.(allState === true ? new Set() : new Set(keys))}
                />
              </th>
            ) : null}
            {columns.map((col) => {
              const active = sort?.key === col.key ? sort.direction : undefined;
              return (
                <th
                  key={col.key}
                  scope="col"
                  data-align={col.align}
                  style={{ width: col.width }}
                  aria-sort={col.sortable ? (active === 'asc' ? 'ascending' : active === 'desc' ? 'descending' : 'none') : undefined}
                >
                  {col.sortable ? (
                    <button type="button" className="ui-table__sort" onClick={() => toggleSort(col.key)}>
                      {col.header}
                      <span className="ui-table__sort-icon" data-active={active ? '' : undefined} aria-hidden="true">
                        {active === 'desc' ? <ArrowDownIcon size={14} /> : <ArrowUpIcon size={14} />}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: Math.max(3, Math.min(data.length, 8)) }, (_, i) => (
              <tr key={`sk-${i}`} aria-hidden="true">
                {Array.from({ length: colCount }, (_, j) => (
                  <td key={j}>
                    <Skeleton width={j === 0 && selectable ? 18 : '70%'} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="ui-table__empty">
                {emptyState ?? <EmptyState title={locale.empty} />}
              </td>
            </tr>
          ) : (
            data.map((row) => {
              const key = rowKey(row);
              const isSelected = selection?.has(key) ?? false;
              return (
                <tr
                  key={key}
                  data-selected={isSelected || undefined}
                  data-clickable={onRowClick ? '' : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {selectable ? (
                    <td className="ui-table__select" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        aria-label={locale.selectRow(rowLabel ? rowLabel(row) : key)}
                        checked={isSelected}
                        onCheckedChange={() => toggleRow(key)}
                      />
                    </td>
                  ) : null}
                  {columns.map((col) => (
                    <td key={col.key} data-align={col.align}>
                      {col.cell ? col.cell(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
