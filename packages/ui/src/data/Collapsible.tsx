import * as React from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { cx } from '../utils';
import { ChevronDownIcon } from '../icons';

export interface CollapsibleProps extends Omit<React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>, 'title'> {
  /** The always-visible trigger text. */
  title: React.ReactNode;
}

const CollapsibleRoot = /* @__PURE__ */ React.forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible(
  { title, className, children, ...rest },
  ref,
) {
  return (
    <CollapsiblePrimitive.Root ref={ref} className={cx('ui-collapsible', className)} {...rest}>
      <CollapsiblePrimitive.Trigger className="ui-collapsible__trigger">
        <ChevronDownIcon size="sm" className="ui-icon ui-collapsible__chevron" />
        <span>{title}</span>
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content className="ui-collapsible__content">{children}</CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
});

/**
 * Shows and hides one section (a disclosure). For several stacked sections use Accordion.
 * For a custom trigger use `Collapsible.Root`, `.Trigger` and `.Content`.
 */
export const Collapsible = /* @__PURE__ */ Object.assign(CollapsibleRoot, {
  Root: CollapsiblePrimitive.Root,
  Trigger: CollapsiblePrimitive.Trigger,
  Content: CollapsiblePrimitive.Content,
});
