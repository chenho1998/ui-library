import * as React from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { cx } from '../utils';
import { usePortalContainer } from '../theme/ThemeProvider';
import { CheckIcon, ChevronRightIcon } from '../icons';

/* Shared item rendering for ContextMenu and Menubar (same look as DropdownMenu). */
interface Loose {
  className?: string;
  children?: React.ReactNode;
  [prop: string]: unknown;
}

type ItemExtras = {
  icon?: React.ReactNode;
  /** Keyboard shortcut hint shown on the right (display only). */
  shortcut?: string;
  tone?: 'neutral' | 'danger';
};

function menuParts<
  P extends {
    Portal: React.ElementType;
    Content: React.ElementType;
    Item: React.ElementType;
    CheckboxItem: React.ElementType;
    RadioItem: React.ElementType;
    ItemIndicator: React.ElementType;
    Label: React.ElementType;
    Separator: React.ElementType;
    SubTrigger: React.ElementType;
    SubContent: React.ElementType;
  },
>(P: P) {
  const Content = React.forwardRef(
    function MenuContent({ className, ...rest }: Loose, ref: React.ForwardedRef<HTMLDivElement>) {
      const container = usePortalContainer();
      return (
        <P.Portal container={container}>
          <P.Content ref={ref} className={cx('ui-menu-surface', 'ui-menu', className)} {...rest} />
        </P.Portal>
      );
    },
  );
  const Item = React.forwardRef(
    function MenuItem({ icon, shortcut, tone = 'neutral', className, children, ...rest }: ItemExtras & Loose, ref: React.ForwardedRef<HTMLDivElement>) {
      return (
        <P.Item ref={ref} className={cx('ui-menu-item', className)} data-tone={tone} {...rest}>
          <span className="ui-menu-item__main">
            {icon ? <span className="ui-menu-item__icon">{icon}</span> : null}
            {children}
          </span>
          {shortcut ? <span className="ui-menu-item__shortcut" aria-hidden="true">{shortcut}</span> : null}
        </P.Item>
      );
    },
  );
  const CheckboxItem = React.forwardRef(
    function MenuCheckboxItem({ className, children, ...rest }: Loose, ref: React.ForwardedRef<HTMLDivElement>) {
      return (
        <P.CheckboxItem ref={ref} className={cx('ui-menu-item', 'ui-menu-item--check', className)} {...rest}>
          <span className="ui-menu-item__check">
            <P.ItemIndicator>
              <CheckIcon size="sm" />
            </P.ItemIndicator>
          </span>
          <span className="ui-menu-item__main">{children}</span>
        </P.CheckboxItem>
      );
    },
  );
  const RadioItem = React.forwardRef(
    function MenuRadioItem({ className, children, ...rest }: Loose, ref: React.ForwardedRef<HTMLDivElement>) {
      return (
        <P.RadioItem ref={ref} className={cx('ui-menu-item', 'ui-menu-item--check', className)} {...rest}>
          <span className="ui-menu-item__check">
            <P.ItemIndicator>
              <span className="ui-menu-item__dot" />
            </P.ItemIndicator>
          </span>
          <span className="ui-menu-item__main">{children}</span>
        </P.RadioItem>
      );
    },
  );
  const Label = ({ className, ...rest }: Loose) => <P.Label className={cx('ui-menu-label', className)} {...rest} />;
  const Separator = () => <P.Separator className="ui-menu-separator" />;
  const SubTrigger = ({ className, children, ...rest }: Loose) => (
    <P.SubTrigger className={cx('ui-menu-item', className)} {...rest}>
      <span className="ui-menu-item__main">{children}</span>
      <ChevronRightIcon size="sm" className="ui-icon ui-menu-item__shortcut" />
    </P.SubTrigger>
  );
  const SubContent = ({ className, ...rest }: Loose) => {
    const container = usePortalContainer();
    return (
      <P.Portal container={container}>
        <P.SubContent className={cx('ui-menu-surface', 'ui-menu', className)} sideOffset={4} {...rest} />
      </P.Portal>
    );
  };
  return { Content, Item, CheckboxItem, RadioItem, Label, Separator, SubTrigger, SubContent };
}

type Extra<T extends React.ElementType> = React.ComponentPropsWithoutRef<T>;
type PartTypes<P extends typeof ContextMenuPrimitive | typeof MenubarPrimitive> = {
  Content: React.ForwardRefExoticComponent<Extra<P['Content']> & React.RefAttributes<HTMLDivElement>>;
  Item: React.ForwardRefExoticComponent<Extra<P['Item']> & ItemExtras & React.RefAttributes<HTMLDivElement>>;
  CheckboxItem: React.ForwardRefExoticComponent<Extra<P['CheckboxItem']> & React.RefAttributes<HTMLDivElement>>;
  RadioItem: React.ForwardRefExoticComponent<Extra<P['RadioItem']> & React.RefAttributes<HTMLDivElement>>;
  Label: (props: Extra<P['Label']>) => React.JSX.Element;
  Separator: () => React.JSX.Element;
  SubTrigger: (props: Extra<P['SubTrigger']>) => React.JSX.Element;
  SubContent: (props: Extra<P['SubContent']>) => React.JSX.Element;
};

/** Attach the shared parts to a menu root in one call, so bundlers can drop unused menus (no property reads at module level). */
function withParts<T>(root: object, extra: object, parts: object): T {
  return Object.assign(root, extra, parts) as T;
}

type ContextMenuComponent = ((props: ContextMenuPrimitive.ContextMenuProps) => React.JSX.Element) & {
  Root: typeof ContextMenuPrimitive.Root;
  Trigger: typeof ContextMenuPrimitive.Trigger;
  Group: typeof ContextMenuPrimitive.Group;
  RadioGroup: typeof ContextMenuPrimitive.RadioGroup;
  Sub: typeof ContextMenuPrimitive.Sub;
} & PartTypes<typeof ContextMenuPrimitive>;

/** A menu opened by right-clicking (or long-pressing, or Shift+F10) an area. Same parts as DropdownMenu. */
export const ContextMenu: ContextMenuComponent = /* @__PURE__ */ withParts(
  (props: ContextMenuPrimitive.ContextMenuProps) => <ContextMenuPrimitive.Root {...props} />,
  {
    Root: ContextMenuPrimitive.Root,
    Trigger: ContextMenuPrimitive.Trigger,
    Group: ContextMenuPrimitive.Group,
    RadioGroup: ContextMenuPrimitive.RadioGroup,
    Sub: ContextMenuPrimitive.Sub,
  },
  /* @__PURE__ */ menuParts(ContextMenuPrimitive),
);

const MenubarRoot = /* @__PURE__ */ React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>>(function Menubar(
  { className, ...rest },
  ref,
) {
  return <MenubarPrimitive.Root ref={ref} className={cx('ui-menubar', className)} {...rest} />;
});

const MenubarTrigger = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>>(
  function MenubarTrigger({ className, ...rest }, ref) {
    return <MenubarPrimitive.Trigger ref={ref} className={cx('ui-menubar__trigger', className)} {...rest} />;
  },
);

type MenubarComponent = typeof MenubarRoot & {
  Menu: typeof MenubarPrimitive.Menu;
  Trigger: typeof MenubarTrigger;
  Group: typeof MenubarPrimitive.Group;
  RadioGroup: typeof MenubarPrimitive.RadioGroup;
  Sub: typeof MenubarPrimitive.Sub;
} & PartTypes<typeof MenubarPrimitive>;

/** A row of menus (File, Edit, View…) for app-like tools, with arrow-key movement between menus. */
export const Menubar: MenubarComponent = /* @__PURE__ */ withParts(
  MenubarRoot,
  {
    Menu: MenubarPrimitive.Menu,
    Trigger: MenubarTrigger,
    Group: MenubarPrimitive.Group,
    RadioGroup: MenubarPrimitive.RadioGroup,
    Sub: MenubarPrimitive.Sub,
  },
  /* @__PURE__ */ menuParts(MenubarPrimitive),
);
