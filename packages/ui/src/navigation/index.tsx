import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { Slot } from '@radix-ui/react-slot';
import { cx, useControllableState } from '../utils';
import { useLocaleOverrides } from '../theme/ThemeProvider';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';

/* ---------- Tabs ---------- */
export interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  /** `line` underlines the active tab; `pill` fills it. Default `'line'`. */
  variant?: 'line' | 'pill';
}

const TabsRoot = /* @__PURE__ */ React.forwardRef<HTMLDivElement, TabsProps>(function Tabs({ variant = 'line', className, ...rest }, ref) {
  return <TabsPrimitive.Root ref={ref} className={cx('ui-tabs', className)} data-variant={variant} {...rest} />;
});
const TabsList = /* @__PURE__ */ React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(
  function TabsList({ className, ...rest }, ref) {
    return <TabsPrimitive.List ref={ref} className={cx('ui-tabs__list', className)} {...rest} />;
  },
);
const TabsTrigger = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(
  function TabsTrigger({ className, ...rest }, ref) {
    return <TabsPrimitive.Trigger ref={ref} className={cx('ui-tabs__trigger', className)} {...rest} />;
  },
);
const TabsContent = /* @__PURE__ */ React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(
  function TabsContent({ className, ...rest }, ref) {
    return <TabsPrimitive.Content ref={ref} className={cx('ui-tabs__content', className)} {...rest} />;
  },
);

/**
 * Switches between related panels on one page. Arrow keys move between tabs.
 *
 * ```tsx
 * <Tabs defaultValue="a"><Tabs.List aria-label="Settings"><Tabs.Trigger value="a">General</Tabs.Trigger>…</Tabs.List>
 * <Tabs.Content value="a">…</Tabs.Content></Tabs>
 * ```
 */
export const Tabs = /* @__PURE__ */ Object.assign(TabsRoot, { List: TabsList, Trigger: TabsTrigger, Content: TabsContent });

/* ---------- Breadcrumbs ---------- */
export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  /** Render each link with your router, e.g. `(item, children) => <NextLink href={item.href}>{children}</NextLink>`. */
  renderLink?: (item: BreadcrumbItem, children: React.ReactNode) => React.ReactElement;
}

/** Shows where the current page sits in the site hierarchy. The last item is the current page. */
export const Breadcrumbs = /* @__PURE__ */ React.forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, renderLink, className, ...rest },
  ref,
) {
  const locale = useLocaleOverrides();
  return (
    <nav ref={ref} aria-label={locale.breadcrumb ?? 'Breadcrumb'} className={cx('ui-breadcrumbs', className)} {...rest}>
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i}>
              {last || !item.href ? (
                <span aria-current={last ? 'page' : undefined} className="ui-breadcrumbs__current">
                  {item.label}
                </span>
              ) : renderLink ? (
                <Slot className="ui-breadcrumbs__link">{renderLink(item, item.label)}</Slot>
              ) : (
                <a href={item.href} className="ui-breadcrumbs__link">
                  {item.label}
                </a>
              )}
              {last ? null : (
                <span className="ui-breadcrumbs__separator" aria-hidden="true">
                  <ChevronRightIcon size={14} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

/* ---------- Pagination ---------- */
export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current page, 1-based. Omit with `defaultPage` for uncontrolled usage. */
  page?: number;
  /** Initial page when uncontrolled. Default 1. */
  defaultPage?: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  /** Pages shown each side of the current one. Default 1. */
  siblingCount?: number;
}

/** Build the list of page numbers with `'…'` gaps. Exported for custom pagers. */
export function getPageRange(page: number, pageCount: number, siblingCount = 1): Array<number | 'gap'> {
  if (pageCount <= 0) return [];
  const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  if (pageCount <= siblingCount * 2 + 5) return range(1, pageCount);
  const left = Math.max(page - siblingCount, 1);
  const right = Math.min(page + siblingCount, pageCount);
  const leftGap = left > 3;
  const rightGap = right < pageCount - 2;
  const edge = 3 + siblingCount * 2;
  if (!leftGap && rightGap) return [...range(1, edge), 'gap', pageCount];
  if (leftGap && !rightGap) return [1, 'gap', ...range(pageCount - edge + 1, pageCount)];
  return [1, 'gap', ...range(left, right), 'gap', pageCount];
}

/** Moves between pages of a long list or table. */
export const Pagination = /* @__PURE__ */ React.forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page: controlledPage, defaultPage = 1, pageCount, onPageChange, siblingCount = 1, className, ...rest },
  ref,
) {
  const locale = useLocaleOverrides();
  const [rawPage, setPage] = useControllableState(controlledPage, defaultPage, onPageChange);
  const total = Math.max(1, pageCount);
  const page = Math.min(total, Math.max(1, rawPage));
  const range = getPageRange(page, total, siblingCount);
  const pageLabel = locale.page ?? ((n: number) => `Page ${n}`);
  return (
    <nav ref={ref} aria-label={locale.pagination ?? 'Pagination'} className={cx('ui-pagination', className)} {...rest}>
      <ul>
        <li>
          <button type="button" className="ui-pagination__item" aria-label={locale.previousPage ?? 'Previous page'} disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeftIcon size="sm" />
          </button>
        </li>
        {range.map((p, i) =>
          p === 'gap' ? (
            <li key={`gap-${i}`} className="ui-pagination__gap" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                className="ui-pagination__item"
                aria-label={pageLabel(p)}
                aria-current={p === page ? 'page' : undefined}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            </li>
          ),
        )}
        <li>
          <button type="button" className="ui-pagination__item" aria-label={locale.nextPage ?? 'Next page'} disabled={page >= total} onClick={() => setPage(page + 1)}>
            <ChevronRightIcon size="sm" />
          </button>
        </li>
      </ul>
    </nav>
  );
});
