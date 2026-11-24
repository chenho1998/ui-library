import * as React from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cx } from '../utils';
import { useLocaleOverrides } from '../theme/ThemeProvider';
import { ChevronDownIcon, PanelLeftIcon } from '../icons';
import { Tooltip } from '../overlays';

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}
const SidebarContext = /* @__PURE__ */ React.createContext<SidebarContextValue>({ collapsed: false, setCollapsed: () => {} });

/** Collapsed state of the surrounding Sidebar, e.g. for a custom toggle. */
export const useSidebar = () => React.useContext(SidebarContext);

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Icons only. Labels stay available to screen readers and show as tooltips. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Names the navigation landmark. Default "Main". */
  'aria-label'?: string;
}

const SidebarRoot = /* @__PURE__ */ React.forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { collapsed: controlled, defaultCollapsed = false, onCollapsedChange, className, children, 'aria-label': ariaLabel = 'Main', ...rest },
  ref,
) {
  const [inner, setInner] = React.useState(defaultCollapsed);
  const collapsed = controlled ?? inner;
  const value = React.useMemo(
    () => ({
      collapsed,
      setCollapsed: (next: boolean) => {
        if (controlled === undefined) setInner(next);
        onCollapsedChange?.(next);
      },
    }),
    [collapsed, controlled, onCollapsedChange],
  );
  return (
    <SidebarContext.Provider value={value}>
      <nav ref={ref} aria-label={ariaLabel} className={cx('ui-sidebar', className)} data-collapsed={collapsed || undefined} {...rest}>
        {children}
      </nav>
    </SidebarContext.Provider>
  );
});

const part = (className: string) =>
  /* @__PURE__ */ React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function SidebarPart({ className: own, ...rest }, ref) {
    return <div ref={ref} className={cx(className, own)} {...rest} />;
  });

export interface SidebarGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Small heading above the group's items. */
  label?: React.ReactNode;
}

const SidebarGroup = /* @__PURE__ */ React.forwardRef<HTMLDivElement, SidebarGroupProps>(function SidebarGroup(
  { label, className, children, ...rest },
  ref,
) {
  const id = React.useId();
  return (
    <div ref={ref} role="group" aria-labelledby={label ? id : undefined} className={cx('ui-sidebar__group', className)} {...rest}>
      {label ? (
        <div id={id} className="ui-sidebar__group-label">
          {label}
        </div>
      ) : null}
      <ul className="ui-sidebar__list">{children}</ul>
    </div>
  );
});

export interface SidebarItemProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  icon?: React.ReactNode;
  /** Count or short status shown on the right (a dot when collapsed). */
  badge?: React.ReactNode;
  /** The page this item links to is the current one. */
  current?: boolean;
  disabled?: boolean;
  /** Render your router's link (e.g. Next.js `Link`) with these styles. */
  asChild?: boolean;
  children: React.ReactNode;
}

/** A link (with `href`) or button in the sidebar. Put it inside `Sidebar.Group` or `Sidebar.Submenu`. */
const SidebarItem = /* @__PURE__ */ React.forwardRef<HTMLAnchorElement, SidebarItemProps>(function SidebarItem(
  { icon, badge, current, disabled, asChild, href, className, children, onClick, ...rest },
  ref,
) {
  const { collapsed } = useSidebar();
  const Comp = (asChild ? Slot : href ? 'a' : 'button') as React.ElementType;
  const element = (
    <Comp
      ref={ref}
      className={cx('ui-sidebar__item', className)}
      href={disabled ? undefined : href}
      type={!asChild && !href ? 'button' : undefined}
      aria-current={current ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
      {...rest}
    >
      {icon ? <span className="ui-sidebar__icon">{icon}</span> : null}
      {asChild ? <Slottable>{children}</Slottable> : <span className="ui-sidebar__label">{children}</span>}
      {/* The space keeps the accessible name readable ("Inbox 3", not "Inbox3"). */}
      {badge !== undefined && badge !== null ? <> <span className="ui-sidebar__badge">{badge}</span></> : null}
    </Comp>
  );
  return (
    <li>
      {collapsed && typeof children === 'string' ? (
        <Tooltip content={children} side="right" delay={200}>
          {element}
        </Tooltip>
      ) : (
        element
      )}
    </li>
  );
});

export interface SidebarSubmenuProps {
  label: React.ReactNode;
  icon?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

/** A labelled, expandable list of nested items. Expanding it from a collapsed sidebar opens the sidebar too. */
const SidebarSubmenu = /* @__PURE__ */ React.forwardRef<HTMLLIElement, SidebarSubmenuProps>(function SidebarSubmenu(
  { label, icon, open: controlled, defaultOpen = false, onOpenChange, children },
  ref,
) {
  const { collapsed, setCollapsed } = useSidebar();
  const [inner, setInner] = React.useState(defaultOpen);
  const open = (controlled ?? inner) && !collapsed;
  const setOpen = (next: boolean) => {
    if (controlled === undefined) setInner(next);
    onOpenChange?.(next);
  };
  return (
    <li ref={ref}>
      <CollapsiblePrimitive.Root
        open={open}
        onOpenChange={(next) => {
          if (collapsed) {
            setCollapsed(false);
            setOpen(true);
          } else setOpen(next);
        }}
      >
        <CollapsiblePrimitive.Trigger className="ui-sidebar__item">
          {icon ? <span className="ui-sidebar__icon">{icon}</span> : null}
          <span className="ui-sidebar__label">{label}</span>
          <ChevronDownIcon size="sm" className="ui-icon ui-sidebar__chevron" />
        </CollapsiblePrimitive.Trigger>
        <CollapsiblePrimitive.Content className="ui-sidebar__sub">
          <ul className="ui-sidebar__list ui-sidebar__sublist">{children}</ul>
        </CollapsiblePrimitive.Content>
      </CollapsiblePrimitive.Root>
    </li>
  );
});

/** Button that collapses and expands the surrounding Sidebar. */
const SidebarToggle = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(function SidebarToggle(
  { className, onClick, ...rest },
  ref,
) {
  const { collapsed, setCollapsed } = useSidebar();
  const locale = useLocaleOverrides();
  return (
    <button
      ref={ref}
      type="button"
      className={cx('ui-sidebar__toggle', className)}
      aria-label={collapsed ? (locale.expandSidebar ?? 'Expand sidebar') : (locale.collapseSidebar ?? 'Collapse sidebar')}
      aria-expanded={!collapsed}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) setCollapsed(!collapsed);
      }}
      {...rest}
    >
      <PanelLeftIcon size="sm" />
    </button>
  );
});

/**
 * App navigation down the left edge: groups of links with icons, badges and nested submenus,
 * collapsible to icons only. On small screens put the same Sidebar inside a `Drawer`.
 */
export const Sidebar = /* @__PURE__ */ Object.assign(SidebarRoot, {
  Header: /* @__PURE__ */ part('ui-sidebar__header'),
  Content: /* @__PURE__ */ part('ui-sidebar__content'),
  Footer: /* @__PURE__ */ part('ui-sidebar__footer'),
  Group: SidebarGroup,
  Item: SidebarItem,
  Submenu: SidebarSubmenu,
  Toggle: SidebarToggle,
});
