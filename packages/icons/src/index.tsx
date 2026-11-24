import * as React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Size token (`sm` 16, `md` 20, `lg` 24) or a pixel number. */
  size?: 'sm' | 'md' | 'lg' | number;
  /** Accessible name. Without it the icon is decorative and hidden from screen readers. */
  label?: string;
}

const px = { sm: 16, md: 20, lg: 24 } as const;

/** Build a stroke-based 24×24 SVG icon component with consistent sizing and accessibility props. */
export function createIcon(name: string, path: React.ReactNode) {
  const Icon = /* @__PURE__ */ React.forwardRef<SVGSVGElement, IconProps>(({ size = 'md', label, className, ...rest }, ref) => {
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
        className={className ? (className.includes('ui-icon') ? className : `ui-icon ${className}`) : 'ui-icon'}
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

export const HomeIcon = /* @__PURE__ */ createIcon('HomeIcon', <><path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z" /></>);
export const SettingsIcon = /* @__PURE__ */ createIcon('SettingsIcon', <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>);
export const UsersIcon = /* @__PURE__ */ createIcon('UsersIcon', <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>);
export const FolderIcon = /* @__PURE__ */ createIcon('FolderIcon', <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />);
export const FileIcon = /* @__PURE__ */ createIcon('FileIcon', <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></>);
export const ChartIcon = /* @__PURE__ */ createIcon('ChartIcon', <path d="M3 3v18h18M7 16v-4M12 16V8M17 16v-7" />);
export const BellIcon = /* @__PURE__ */ createIcon('BellIcon', <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" /></>);
export const ClockIcon = /* @__PURE__ */ createIcon('ClockIcon', <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>);
export const UploadIcon = /* @__PURE__ */ createIcon('UploadIcon', <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />);
export const StarIcon = /* @__PURE__ */ createIcon('StarIcon', <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />);
export const MenuIcon = /* @__PURE__ */ createIcon('MenuIcon', <path d="M4 6h16M4 12h16M4 18h16" />);
export const PanelLeftIcon = /* @__PURE__ */ createIcon('PanelLeftIcon', <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /></>);

export const CopyIcon = /* @__PURE__ */ createIcon('CopyIcon', <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>);
export const TrashIcon = /* @__PURE__ */ createIcon('TrashIcon', <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />);
export const EditIcon = /* @__PURE__ */ createIcon('EditIcon', <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />);
export const FilterIcon = /* @__PURE__ */ createIcon('FilterIcon', <path d="M22 3H2l8 9.46V19l4 2v-8.54z" />);
export const SunIcon = /* @__PURE__ */ createIcon('SunIcon', <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2m-7.07-17.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" /></>);
export const MoonIcon = /* @__PURE__ */ createIcon('MoonIcon', <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />);
export const EyeIcon = /* @__PURE__ */ createIcon('EyeIcon', <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>);
export const EyeOffIcon = /* @__PURE__ */ createIcon('EyeOffIcon', <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />);
export const ExternalLinkIcon = /* @__PURE__ */ createIcon('ExternalLinkIcon', <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />);
export const RefreshIcon = /* @__PURE__ */ createIcon('RefreshIcon', <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />);
