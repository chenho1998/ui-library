import * as React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Size token or a pixel number. */
  size?: 'sm' | 'md' | 'lg' | number;
  /** Accessible name. Without it the icon is decorative and hidden from screen readers. */
  label?: string;
}

const px = { sm: 16, md: 20, lg: 24 } as const;

function createIcon(name: string, path: React.ReactNode) {
  const Icon = /* @__PURE__ */ React.forwardRef<SVGSVGElement, IconProps>(({ size = 'md', label, ...rest }, ref) => {
    const dim = typeof size === 'number' ? size : px[size];
    return (
      <svg
        ref={ref}
        width={dim}
        height={dim}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ui-icon"
        aria-hidden={label ? undefined : true}
        role={label ? 'img' : undefined}
        aria-label={label}
        focusable="false"
        {...rest}
      >
        {path}
      </svg>
    );
  });
  Icon.displayName = name;
  return Icon;
}

export const CheckIcon = /* @__PURE__ */ createIcon('CheckIcon', <path d="M20 6 9 17l-5-5" />);
export const MinusIcon = /* @__PURE__ */ createIcon('MinusIcon', <path d="M5 12h14" />);
export const PlusIcon = /* @__PURE__ */ createIcon('PlusIcon', <path d="M12 5v14M5 12h14" />);
export const XIcon = /* @__PURE__ */ createIcon('XIcon', <path d="M18 6 6 18M6 6l12 12" />);
export const ChevronDownIcon = /* @__PURE__ */ createIcon('ChevronDownIcon', <path d="m6 9 6 6 6-6" />);
export const ChevronUpIcon = /* @__PURE__ */ createIcon('ChevronUpIcon', <path d="m18 15-6-6-6 6" />);
export const ChevronLeftIcon = /* @__PURE__ */ createIcon('ChevronLeftIcon', <path d="m15 18-6-6 6-6" />);
export const ChevronRightIcon = /* @__PURE__ */ createIcon('ChevronRightIcon', <path d="m9 18 6-6-6-6" />);
export const ArrowUpIcon = /* @__PURE__ */ createIcon('ArrowUpIcon', <path d="M12 19V5M5 12l7-7 7 7" />);
export const ArrowDownIcon = /* @__PURE__ */ createIcon('ArrowDownIcon', <path d="M12 5v14M19 12l-7 7-7-7" />);
export const SearchIcon = /* @__PURE__ */ createIcon('SearchIcon', <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>);
export const InfoIcon = /* @__PURE__ */ createIcon('InfoIcon', <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>);
export const SuccessIcon = /* @__PURE__ */ createIcon('SuccessIcon', <><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>);
export const WarningIcon = /* @__PURE__ */ createIcon('WarningIcon', <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>);
export const DangerIcon = /* @__PURE__ */ createIcon('DangerIcon', <><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>);
export const CalendarIcon = /* @__PURE__ */ createIcon('CalendarIcon', <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>);
export const MoreIcon = /* @__PURE__ */ createIcon('MoreIcon', <><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></>);
export const InboxIcon = /* @__PURE__ */ createIcon('InboxIcon', <><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>);

export { createIcon };
