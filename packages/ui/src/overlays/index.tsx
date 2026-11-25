import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as MenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cx } from '../utils';
import { useLocaleOverrides, usePortalContainer } from '../theme/ThemeProvider';
import { XIcon } from '../icons';
import { Button, type ButtonProps } from '../actions';
import { menuParts, withParts, type MenuItemExtras, type MenuPartTypes } from './menus';

/* =====================================================================
 * Dialog
 * ===================================================================== */

export interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Max width: sm 400 · md 560 · lg 720 · full = whole screen. Default `'md'`. */
  size?: 'sm' | 'md' | 'lg' | 'full';
  /** Close when the backdrop is clicked. Default `true`. */
  closeOnOverlayClick?: boolean;
  /** Show the × button in the corner. Default `true`. */
  showClose?: boolean;
  /** Element to focus first. Default: the first focusable element. */
  initialFocus?: React.RefObject<HTMLElement | null>;
}

const DialogContent = /* @__PURE__ */ React.forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { size = 'md', closeOnOverlayClick = true, showClose = true, initialFocus, className, children, onPointerDownOutside, onOpenAutoFocus, ...rest },
  ref,
) {
  const locale = useLocaleOverrides();
  const container = usePortalContainer();
  return (
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Overlay className="ui-overlay" />
      <DialogPrimitive.Content
        ref={ref}
        className={cx('ui-dialog', className)}
        data-size={size}
        onPointerDownOutside={(e) => {
          if (!closeOnOverlayClick) e.preventDefault();
          onPointerDownOutside?.(e);
        }}
        onOpenAutoFocus={(e) => {
          onOpenAutoFocus?.(e);
          if (initialFocus?.current) {
            e.preventDefault();
            initialFocus.current.focus();
          }
        }}
        {...rest}
      >
        {children}
        {showClose ? (
          <DialogPrimitive.Close className="ui-dialog__close" aria-label={locale.close ?? 'Close'}>
            <XIcon size="sm" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

const DialogTitle = /* @__PURE__ */ React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
  function DialogTitle({ className, ...rest }, ref) {
    return <DialogPrimitive.Title ref={ref} className={cx('ui-dialog__title', className)} {...rest} />;
  },
);

const DialogDescription = /* @__PURE__ */ React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(
  function DialogDescription({ className, ...rest }, ref) {
    return <DialogPrimitive.Description ref={ref} className={cx('ui-dialog__description', className)} {...rest} />;
  },
);

const DialogBody = /* @__PURE__ */ React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function DialogBody(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('ui-dialog__body', className)} {...rest} />;
});
const DialogFooter = /* @__PURE__ */ React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function DialogFooter(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('ui-dialog__footer', className)} {...rest} />;
});

/**
 * A modal window for a focused task. Focus is trapped inside and returns to the trigger on close.
 *
 * ```tsx
 * <Dialog>
 *   <Dialog.Trigger asChild><Button>Edit</Button></Dialog.Trigger>
 *   <Dialog.Content>
 *     <Dialog.Title>Edit profile</Dialog.Title>
 *     <Dialog.Body>…</Dialog.Body>
 *     <Dialog.Footer><Dialog.Close asChild><Button variant="outline">Cancel</Button></Dialog.Close></Dialog.Footer>
 *   </Dialog.Content>
 * </Dialog>
 * ```
 */
export const Dialog = /* @__PURE__ */ Object.assign((props: DialogPrimitive.DialogProps) => <DialogPrimitive.Root {...props} />, {
  Root: DialogPrimitive.Root,
  Trigger: DialogPrimitive.Trigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: DialogPrimitive.Close,
});

/* ---------- AlertDialog ---------- */
export interface AlertDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The element that opens the dialog (rendered with `asChild`). */
  trigger?: React.ReactElement;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Label of the confirming button. Default "Confirm". */
  confirmLabel?: string;
  cancelLabel?: string;
  /** Default `'danger'` for destructive confirmations. */
  tone?: ButtonProps['tone'];
  /** May return a promise; the button shows a spinner until it settles. */
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

/** Confirms a destructive or important action. Overlay clicks are ignored and Cancel gets first focus. */
export function AlertDialog({
  open: controlled, defaultOpen, onOpenChange, trigger, title, description,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel', tone = 'danger', onConfirm, onCancel,
}: AlertDialogProps) {
  const [inner, setInner] = React.useState(defaultOpen ?? false);
  const open = controlled ?? inner;
  const [busy, setBusy] = React.useState(false);
  const setOpen = (v: boolean) => {
    if (busy && !v) return;
    if (controlled === undefined) setInner(v);
    onOpenChange?.(v);
  };
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      {trigger ? <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger> : null}
      <DialogContent
        size="sm"
        role="alertdialog"
        closeOnOverlayClick={false}
        showClose={false}
        initialFocus={cancelRef}
        onEscapeKeyDown={(e) => {
          if (busy) e.preventDefault();
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        {description ? <DialogDescription>{description}</DialogDescription> : null}
        <DialogFooter>
          <Button
            ref={cancelRef}
            variant="outline"
            tone="neutral"
            disabled={busy}
            onClick={() => {
              onCancel?.();
              setOpen(false);
            }}
          >
            {cancelLabel}
          </Button>
          <Button
            tone={tone}
            loading={busy}
            onClick={async () => {
              try {
                setBusy(true);
                await onConfirm?.();
                setBusy(false);
                if (controlled === undefined) setInner(false);
                onOpenChange?.(false);
              } finally {
                setBusy(false);
              }
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPrimitive.Root>
  );
}

/* ---------- Drawer ---------- */
export interface DrawerContentProps extends Omit<DialogContentProps, 'size'> {
  /** Edge it slides in from. Default `'right'`. */
  side?: 'left' | 'right';
  /** Width: sm 320 · md 400 · lg 560. Default `'md'`. */
  size?: 'sm' | 'md' | 'lg';
}

const DrawerContent = /* @__PURE__ */ React.forwardRef<HTMLDivElement, DrawerContentProps>(function DrawerContent(
  { side = 'right', size = 'md', className, ...rest },
  ref,
) {
  return <DialogContent ref={ref} className={cx('ui-drawer', className)} data-side={side} data-drawer-size={size} {...rest} />;
});

/** A panel that slides in from the edge for secondary tasks, filters or details. Same parts as Dialog. */
export const Drawer = /* @__PURE__ */ Object.assign((props: DialogPrimitive.DialogProps) => <DialogPrimitive.Root {...props} />, {
  Root: DialogPrimitive.Root,
  Trigger: DialogPrimitive.Trigger,
  Content: DrawerContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: DialogPrimitive.Close,
});

/* =====================================================================
 * Popover
 * ===================================================================== */
export interface PopoverContentProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  /** Show a small arrow pointing at the trigger. */
  arrow?: boolean;
}

const PopoverContent = /* @__PURE__ */ React.forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
  { className, sideOffset = 6, arrow, children, ...rest },
  ref,
) {
  const container = usePortalContainer();
  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content ref={ref} sideOffset={sideOffset} className={cx('ui-popover', className)} {...rest}>
        {children}
        {arrow ? <PopoverPrimitive.Arrow className="ui-popover__arrow" width={12} height={6} /> : null}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});

/** Non-modal floating content anchored to a trigger (forms, details, pickers). */
export const Popover = /* @__PURE__ */ Object.assign((props: PopoverPrimitive.PopoverProps) => <PopoverPrimitive.Root {...props} />, {
  Root: PopoverPrimitive.Root,
  Trigger: PopoverPrimitive.Trigger,
  Anchor: PopoverPrimitive.Anchor,
  Content: PopoverContent,
  Close: PopoverPrimitive.Close,
});

/* =====================================================================
 * Tooltip
 * ===================================================================== */
export interface TooltipProps {
  /** Short text shown on hover and focus. Never put interactive content in a tooltip. */
  content: React.ReactNode;
  /** The trigger. Must be focusable (e.g. a button). */
  children: React.ReactElement;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  /** Milliseconds before showing. Default 400. */
  delay?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Disable the tooltip and render `children` directly. */
  disabled?: boolean;
}

/** A short label or hint for a control, shown on hover and keyboard focus. */
export function Tooltip({ content, children, side = 'top', align = 'center', delay = 400, open, defaultOpen, onOpenChange, disabled }: TooltipProps) {
  const container = usePortalContainer();
  if (disabled) return children;
  return (
    <TooltipPrimitive.Provider delayDuration={delay}>
      <TooltipPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal container={container}>
          <TooltipPrimitive.Content className="ui-tooltip" side={side} align={align} sideOffset={6} collisionPadding={8}>
            {content}
            <TooltipPrimitive.Arrow className="ui-tooltip__arrow" width={10} height={5} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

/* =====================================================================
 * DropdownMenu
 * ===================================================================== */
export interface MenuItemProps extends React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>, MenuItemExtras {}

type DropdownMenuComponent = ((props: MenuPrimitive.DropdownMenuProps) => React.JSX.Element) & {
  Root: typeof MenuPrimitive.Root;
  Trigger: typeof MenuPrimitive.Trigger;
  Group: typeof MenuPrimitive.Group;
  RadioGroup: typeof MenuPrimitive.RadioGroup;
  Sub: typeof MenuPrimitive.Sub;
} & MenuPartTypes<typeof MenuPrimitive>;

/** A list of actions or options opened from a button. Full keyboard, submenu and type-ahead support. */
export const DropdownMenu: DropdownMenuComponent = /* @__PURE__ */ withParts(
  (props: MenuPrimitive.DropdownMenuProps) => <MenuPrimitive.Root {...props} />,
  {
    Root: MenuPrimitive.Root,
    Trigger: MenuPrimitive.Trigger,
    Group: MenuPrimitive.Group,
    RadioGroup: MenuPrimitive.RadioGroup,
    Sub: MenuPrimitive.Sub,
  },
  /* @__PURE__ */ menuParts(MenuPrimitive, { sideOffset: 4, align: 'start' }),
);
