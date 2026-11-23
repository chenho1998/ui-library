import * as React from 'react';
import { cx } from '../utils';
import { ArrowDownIcon, ArrowUpIcon, ChevronRightIcon } from '../icons';

/* ---------- Timeline ---------- */
export interface TimelineItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'title'> {
  title: React.ReactNode;
  /** When it happened: a string, or a Date shown in the user's locale. */
  time?: string | Date;
  /** Replaces the dot. */
  icon?: React.ReactNode;
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
}

function TimelineItem({ title, time, icon, tone = 'neutral', className, children, ...rest }: TimelineItemProps) {
  const iso = time instanceof Date ? time.toISOString() : undefined;
  const shown = time instanceof Date ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(time) : time;
  return (
    <li className={cx('ui-timeline__item', className)} data-tone={tone} {...rest}>
      <span className="ui-timeline__marker" aria-hidden="true">
        {icon ?? <span className="ui-timeline__dot" />}
      </span>
      <div className="ui-timeline__body">
        <div className="ui-timeline__header">
          <span className="ui-timeline__title">{title}</span>
          {shown ? <time className="ui-timeline__time" dateTime={iso}>{shown}</time> : null}
        </div>
        {children ? <div className="ui-timeline__content">{children}</div> : null}
      </div>
    </li>
  );
}

/** Events in order, newest first or oldest first: activity feeds, order history, audit logs. */
export const Timeline = /* @__PURE__ */ Object.assign(
  /* @__PURE__ */ React.forwardRef<HTMLOListElement, React.OlHTMLAttributes<HTMLOListElement>>(function Timeline({ className, ...rest }, ref) {
    return <ol ref={ref} className={cx('ui-timeline', className)} {...rest} />;
  }),
  { Item: TimelineItem },
);

/* ---------- TreeView ---------- */
export interface TreeNode {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeViewProps {
  items: TreeNode[];
  'aria-label': string;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}

/** A nested, expandable list such as files and folders (WAI-ARIA tree: arrows move and expand, Enter selects). */
export function TreeView({
  items, 'aria-label': ariaLabel, expanded, defaultExpanded = [], onExpandedChange, selected, defaultSelected = null, onSelect, className,
}: TreeViewProps) {
  const baseId = React.useId();
  const [innerOpen, setInnerOpen] = React.useState<string[]>(defaultExpanded);
  const open = expanded ?? innerOpen;
  const [innerSel, setInnerSel] = React.useState<string | null>(defaultSelected);
  const sel = selected !== undefined ? selected : innerSel;
  const [focusId, setFocusId] = React.useState<string | null>(null);
  const moved = React.useRef(false);

  // Visible rows in order, with their parent, for keyboard movement.
  const rows: Array<{ node: TreeNode; parent: string | null }> = [];
  const walk = (nodes: TreeNode[], parent: string | null) => {
    for (const node of nodes) {
      rows.push({ node, parent });
      if (node.children?.length && open.includes(node.id)) walk(node.children, node.id);
    }
  };
  walk(items, null);
  const current = focusId ?? sel ?? rows[0]?.node.id ?? null;

  React.useEffect(() => {
    if (moved.current && current) document.getElementById(`${baseId}-${current}`)?.focus();
  }, [current, baseId]);

  const setOpen = (ids: string[]) => {
    if (expanded === undefined) setInnerOpen(ids);
    onExpandedChange?.(ids);
  };
  const toggle = (id: string, to?: boolean) => {
    const isOpen = open.includes(id);
    const next = to ?? !isOpen;
    if (next !== isOpen) setOpen(next ? [...open, id] : open.filter((x) => x !== id));
  };
  const select = (node: TreeNode) => {
    if (node.disabled) return;
    if (selected === undefined) setInnerSel(node.id);
    onSelect?.(node.id);
  };
  const focus = (id: string | null | undefined) => {
    if (!id) return;
    moved.current = true;
    setFocusId(id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const index = rows.findIndex((r) => r.node.id === current);
    const row = rows[index];
    if (!row) return;
    const hasKids = !!row.node.children?.length;
    const isOpen = open.includes(row.node.id);
    switch (e.key) {
      case 'ArrowDown': focus(rows[index + 1]?.node.id); break;
      case 'ArrowUp': focus(rows[index - 1]?.node.id); break;
      case 'Home': focus(rows[0]?.node.id); break;
      case 'End': focus(rows[rows.length - 1]?.node.id); break;
      case 'ArrowRight':
        if (hasKids && !isOpen) toggle(row.node.id, true);
        else if (hasKids) focus(row.node.children![0]!.id);
        break;
      case 'ArrowLeft':
        if (hasKids && isOpen) toggle(row.node.id, false);
        else focus(row.parent);
        break;
      case 'Enter':
      case ' ':
        select(row.node);
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  const renderNodes = (nodes: TreeNode[], level: number): React.ReactNode =>
    nodes.map((node, i) => {
      const hasKids = !!node.children?.length;
      const isOpen = hasKids && open.includes(node.id);
      return (
        <li
          key={node.id}
          id={`${baseId}-${node.id}`}
          role="treeitem"
          aria-level={level}
          aria-setsize={nodes.length}
          aria-posinset={i + 1}
          aria-expanded={hasKids ? isOpen : undefined}
          aria-selected={sel === node.id}
          aria-disabled={node.disabled || undefined}
          tabIndex={current === node.id ? 0 : -1}
          className="ui-tree__item"
          onFocus={(e) => {
            if (e.target === e.currentTarget) setFocusId(node.id);
          }}
        >
          {/* Rows are clicked with a pointer; the treeitem handles the keyboard. */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            className="ui-tree__row"
            style={{ paddingInlineStart: `calc(${level - 1} * var(--ui-space-5) + var(--ui-space-2))` }}
            onClick={() => {
              focus(node.id);
              if (hasKids) toggle(node.id);
              select(node);
            }}
          >
            <span className="ui-tree__chevron" data-open={isOpen || undefined} aria-hidden="true">
              {hasKids ? <ChevronRightIcon size="sm" /> : null}
            </span>
            {node.icon ? <span className="ui-tree__icon">{node.icon}</span> : null}
            <span className="ui-tree__label">{node.label}</span>
          </div>
          {isOpen ? (
            <ul role="group" className="ui-tree__group">
              {renderNodes(node.children!, level + 1)}
            </ul>
          ) : null}
        </li>
      );
    });

  return (
    // The tree owns arrow-key navigation between its items (WAI-ARIA tree pattern).
     
    <ul role="tree" aria-label={ariaLabel} className={cx('ui-tree', className)} onKeyDown={onKeyDown}>
      {renderNodes(items, 1)}
    </ul>
  );
}

/* ---------- Stat ---------- */
export interface StatProps extends Omit<React.HTMLAttributes<HTMLDListElement>, 'children'> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Change as a percentage, e.g. `12.4` or `-3`. */
  change?: number;
  /** Context for the change, e.g. "vs last month". */
  changeLabel?: React.ReactNode;
  /** A fall is good news (e.g. churn, response time). */
  invertTrend?: boolean;
  icon?: React.ReactNode;
}

/** One key number with its label and how it changed (KPI tile). */
export const Stat = /* @__PURE__ */ React.forwardRef<HTMLDListElement, StatProps>(function Stat(
  { label, value, change, changeLabel, invertTrend, icon, className, ...rest },
  ref,
) {
  const up = (change ?? 0) >= 0;
  const good = invertTrend ? !up : up;
  return (
    <dl ref={ref} className={cx('ui-stat', className)} {...rest}>
      <dt className="ui-stat__label">
        {icon ? <span className="ui-stat__icon">{icon}</span> : null}
        {label}
      </dt>
      <dd className="ui-stat__value">{value}</dd>
      {change !== undefined ? (
        <dd className="ui-stat__change" data-trend={change === 0 ? 'flat' : good ? 'good' : 'bad'}>
          {change === 0 ? null : up ? <ArrowUpIcon size={14} /> : <ArrowDownIcon size={14} />}
          <span>
            {up && change > 0 ? '+' : ''}
            {change}%
          </span>
          {changeLabel ? <span className="ui-stat__context">{changeLabel}</span> : null}
        </dd>
      ) : null}
    </dl>
  );
});

/* ---------- DescriptionList ---------- */
export interface DescriptionListProps extends React.HTMLAttributes<HTMLDListElement> {
  /** `stacked` puts each term above its value; `inline` puts them side by side. Default `'stacked'`. */
  layout?: 'stacked' | 'inline';
  /** Columns of items for `stacked`. Default 1. */
  columns?: number;
}

function DescriptionItem({ term, children, className }: { term: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={cx('ui-dl__item', className)}>
      <dt className="ui-dl__term">{term}</dt>
      <dd className="ui-dl__detail">{children}</dd>
    </div>
  );
}

/** Label and value pairs, such as order details or a profile summary. */
export const DescriptionList = /* @__PURE__ */ Object.assign(
  /* @__PURE__ */ React.forwardRef<HTMLDListElement, DescriptionListProps>(function DescriptionList(
    { layout = 'stacked', columns = 1, className, style, ...rest },
    ref,
  ) {
    return (
      <dl
        ref={ref}
        className={cx('ui-dl', className)}
        data-layout={layout}
        style={{ gridTemplateColumns: layout === 'stacked' ? `repeat(${columns}, minmax(0, 1fr))` : undefined, ...style }}
        {...rest}
      />
    );
  }),
  { Item: DescriptionItem },
);
