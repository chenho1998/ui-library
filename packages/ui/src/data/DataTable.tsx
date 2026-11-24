import * as React from 'react';
import { cx, useControllableState } from '../utils';
import { useLocaleOverrides } from '../theme/ThemeProvider';
import { SearchIcon, XIcon } from '../icons';
import { Pagination } from '../navigation';
import { Table, type TableColumn, type TableProps, type TableSort } from './index';

export interface DataTableColumn<T> extends TableColumn<T> {
  /** Value used for client-side sorting. Defaults to `row[key]`. */
  sortValue?: (row: T) => string | number | Date | null | undefined;
  /** Include this column in default search filtering. Default `true`. */
  filterable?: boolean;
  /** Text extracted from the row for client-side search. Defaults to `String(row[key] ?? '')`. */
  filterValue?: (row: T) => string;
}

export interface DataTableProps<T>
  extends Omit<TableProps<T>, 'columns' | 'sort' | 'onSortChange' | 'selection' | 'onSelectionChange'> {
  columns: DataTableColumn<T>[];
  /** Controlled sort state. Omit for built-in client-side sorting. */
  sort?: TableSort | null;
  defaultSort?: TableSort | null;
  onSortChange?: (sort: TableSort | null) => void;
  /** Skip client-side sorting when the server already returns sorted rows. */
  manualSort?: boolean;
  /** Show a search input above the table. */
  searchable?: boolean;
  searchPlaceholder?: string;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** Custom filter predicate; pass `false` when filtering on a server. */
  filterFn?: ((row: T, query: string) => boolean) | false;
  /** Enable row selection checkboxes (works uncontrolled without passing `selection`). */
  selectable?: boolean;
  selection?: Set<string>;
  defaultSelection?: Set<string>;
  onSelectionChange?: (selection: Set<string>) => void;
  /** Rows per page. Omit to show all rows without pagination. */
  pageSize?: number;
  /** Controlled 1-based page number. */
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Total row count for server-side pagination (when `data` holds only the current page). */
  totalCount?: number;
  /** Extra controls placed on the right of the toolbar (e.g. filters or an "Add" button). */
  toolbar?: React.ReactNode;
  /** Actions shown while one or more rows are selected. */
  bulkActions?: (selected: Set<string>, clear: () => void) => React.ReactNode;
  /** Class for the outer wrapper around toolbar, table and pagination. */
  wrapperClassName?: string;
}

function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

const EMPTY_SET = new Set<string>();

/**
 * Full-featured data table with built-in client-side (or manual server-side) sorting, search filtering,
 * row selection, bulk actions and pagination. Built on `Table` and `Pagination`.
 */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  caption,
  hideCaption,
  sort: controlledSort,
  defaultSort = null,
  onSortChange,
  manualSort = false,
  searchable = false,
  searchPlaceholder,
  query: controlledQuery,
  defaultQuery = '',
  onQueryChange,
  filterFn,
  selectable = false,
  selection: controlledSelection,
  defaultSelection = EMPTY_SET,
  onSelectionChange,
  pageSize,
  page: controlledPage,
  defaultPage = 1,
  onPageChange,
  totalCount,
  toolbar,
  bulkActions,
  wrapperClassName,
  ...tableRest
}: DataTableProps<T>) {
  const locale = useLocaleOverrides();
  const [sort, setSort] = useControllableState<TableSort | null>(controlledSort, defaultSort, onSortChange);
  const [query, setQuery] = useControllableState<string>(controlledQuery, defaultQuery, onQueryChange);
  const [selection, setSelection] = useControllableState<Set<string>>(controlledSelection, defaultSelection, onSelectionChange);
  const [page, setPage] = useControllableState<number>(controlledPage, defaultPage, onPageChange);

  const hasSelection = selectable || controlledSelection !== undefined;

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || filterFn === false) return data;
    if (filterFn) return data.filter((row) => filterFn(row, query));
    const searchableCols = columns.filter((c) => c.filterable !== false);
    return data.filter((row) =>
      searchableCols.some((col) => {
        const text = col.filterValue ? col.filterValue(row) : String((row as Record<string, unknown>)[col.key] ?? '');
        return text.toLowerCase().includes(q);
      }),
    );
  }, [data, query, filterFn, columns]);

  const sorted = React.useMemo(() => {
    if (!sort || manualSort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    const getVal = (row: T) => (col?.sortValue ? col.sortValue(row) : (row as Record<string, unknown>)[sort.key]);
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => compareValues(getVal(a), getVal(b)) * dir);
  }, [filtered, sort, manualSort, columns]);

  const total = totalCount ?? sorted.length;
  const pageCount = pageSize ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const safePage = Math.min(pageCount, Math.max(1, page));
  const paged = React.useMemo(() => {
    if (!pageSize || totalCount !== undefined) return sorted;
    const start = (safePage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, pageSize, totalCount, safePage]);

  const startRow = total === 0 ? 0 : (safePage - 1) * (pageSize ?? total) + 1;
  const endRow = pageSize ? Math.min(total, safePage * pageSize) : total;
  const placeholder = searchPlaceholder ?? locale.searchPlaceholder ?? 'Filter rows…';

  const handleQueryChange = (next: string) => {
    setQuery(next);
    if (safePage !== 1) setPage(1);
  };

  return (
    <div className={cx('ui-datatable', wrapperClassName)}>
      {searchable || toolbar ? (
        <div className="ui-datatable__toolbar">
          {searchable ? (
            <div className="ui-input ui-datatable__search" data-size="sm">
              <span className="ui-input__adornment" aria-hidden="true">
                <SearchIcon size="sm" />
              </span>
              <input
                type="search"
                className="ui-input__control"
                aria-label={placeholder}
                placeholder={placeholder}
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
              />
              {query ? (
                <button
                  type="button"
                  className="ui-datatable__clear"
                  aria-label={locale.dismiss ?? 'Clear filter'}
                  onClick={() => handleQueryChange('')}
                >
                  <XIcon size={14} />
                </button>
              ) : null}
            </div>
          ) : null}
          {toolbar ? <div className="ui-datatable__actions">{toolbar}</div> : null}
        </div>
      ) : null}

      {hasSelection && selection.size > 0 && bulkActions ? (
        <div className="ui-datatable__bulk" role="status" aria-live="polite">
          <span className="ui-datatable__bulk-count">{selection.size} selected</span>
          <div className="ui-datatable__bulk-actions">{bulkActions(selection, () => setSelection(new Set()))}</div>
        </div>
      ) : null}

      <Table
        columns={columns}
        data={paged}
        rowKey={rowKey}
        caption={caption}
        hideCaption={hideCaption}
        sort={sort}
        onSortChange={setSort}
        selection={hasSelection ? selection : undefined}
        onSelectionChange={hasSelection ? setSelection : undefined}
        {...tableRest}
      />

      {pageSize && total > 0 ? (
        <div className="ui-datatable__footer">
          <span className="ui-datatable__summary">
            Showing {startRow}–{endRow} of {total}
          </span>
          {pageCount > 1 ? <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} /> : null}
        </div>
      ) : null}
    </div>
  );
}
