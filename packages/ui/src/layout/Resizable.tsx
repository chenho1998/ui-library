import * as React from 'react';
import { cx, useControllableState } from '../utils';
import { useLocaleOverrides } from '../theme/ThemeProvider';

interface ResizableContextValue {
  orientation: 'horizontal' | 'vertical';
  sizes: number[];
  bounds: Array<{ min: number; max: number }>;
  resizePair: (handleIndex: number, nextFirst: number) => void;
  resizeByDelta: (handleIndex: number, deltaPct: number) => void;
  resetSizes: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const ResizableContext = /* @__PURE__ */ React.createContext<ResizableContextValue | null>(null);

export interface ResizableProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Split direction. Default `'horizontal'` (side-by-side panels). */
  orientation?: 'horizontal' | 'vertical';
  /** Controlled panel sizes as percentages summing to 100. */
  sizes?: number[];
  /** Initial panel sizes as percentages. Defaults to equal splits. */
  defaultSizes?: number[];
  onSizesChange?: (sizes: number[]) => void;
}

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Minimum size in percent (0–100). Default `10`. */
  minSize?: number;
  /** Maximum size in percent (0–100). Default `90`. */
  maxSize?: number;
  /** Internal index assigned automatically by `Resizable`. */
  'data-panel-index'?: number;
}

export interface ResizableHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show a visual grip indicator. Default `true`. */
  withGrip?: boolean;
  /** Keyboard step in percent. Default `2` (Shift multiplies by 5). */
  step?: number;
  /** Internal index assigned automatically by `Resizable`. */
  'data-handle-index'?: number;
}

const ResizablePanel = /* @__PURE__ */ React.forwardRef<HTMLDivElement, ResizablePanelProps>(function ResizablePanel(
  { minSize: _min, maxSize: _max, className, style, 'data-panel-index': index = 0, ...rest },
  ref,
) {
  const ctx = React.useContext(ResizableContext);
  const size = ctx?.sizes[index];
  return (
    <div
      ref={ref}
      className={cx('ui-resizable__panel', className)}
      style={{ flexBasis: size !== undefined ? `${size}%` : undefined, flexGrow: size !== undefined ? 0 : 1, flexShrink: 0, ...style }}
      {...rest}
    />
  );
});

const ResizableHandle = /* @__PURE__ */ React.forwardRef<HTMLDivElement, ResizableHandleProps>(function ResizableHandle(
  { withGrip = true, step = 2, className, 'aria-label': ariaLabel, 'data-handle-index': handleIndex = 0, onKeyDown, onDoubleClick, ...rest },
  ref,
) {
  const ctx = React.useContext(ResizableContext);
  const locale = useLocaleOverrides();
  const [dragging, setDragging] = React.useState(false);
  const dragRef = React.useRef<{ startPos: number; startSize: number; totalPx: number } | null>(null);

  const orientation = ctx?.orientation ?? 'horizontal';
  // Per WAI-ARIA window splitter, a horizontal split has a vertical separator bar and vice versa.
  const ariaOrientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';
  const current = Math.round(ctx?.sizes[handleIndex] ?? 50);
  const bounds = ctx?.bounds[handleIndex] ?? { min: 10, max: 90 };

  return (
    // WAI-ARIA window splitter separator handles keyboard arrows, Home/End, Enter and pointer drag.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={ref}
      role="separator"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      aria-label={ariaLabel ?? locale.resizePanel ?? 'Resize panel'}
      aria-orientation={ariaOrientation}
      aria-valuemin={bounds.min}
      aria-valuemax={bounds.max}
      aria-valuenow={current}
      className={cx('ui-resizable__handle', className)}
      data-orientation={orientation}
      data-dragging={dragging || undefined}
      onPointerDown={(e) => {
        if (!ctx || e.button !== 0) return;
        const container = ctx.containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const totalPx = orientation === 'horizontal' ? rect.width : rect.height;
        if (!totalPx) return;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        dragRef.current = {
          startPos: orientation === 'horizontal' ? e.clientX : e.clientY,
          startSize: ctx.sizes[handleIndex] ?? 50,
          totalPx,
        };
        setDragging(true);
      }}
      onPointerMove={(e) => {
        const d = dragRef.current;
        if (!d || !ctx) return;
        const pos = orientation === 'horizontal' ? e.clientX : e.clientY;
        const deltaPct = ((pos - d.startPos) / d.totalPx) * 100;
        ctx.resizePair(handleIndex, d.startSize + deltaPct);
      }}
      onPointerUp={() => {
        dragRef.current = null;
        setDragging(false);
      }}
      onPointerCancel={() => {
        dragRef.current = null;
        setDragging(false);
      }}
      onDoubleClick={(e) => {
        ctx?.resetSizes();
        onDoubleClick?.(e);
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || !ctx) return;
        const delta = e.shiftKey ? step * 5 : step;
        const decKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
        const incKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
        if (e.key === decKey) { e.preventDefault(); ctx.resizeByDelta(handleIndex, -delta); }
        else if (e.key === incKey) { e.preventDefault(); ctx.resizeByDelta(handleIndex, delta); }
        else if (e.key === 'Home') { e.preventDefault(); ctx.resizePair(handleIndex, bounds.min); }
        else if (e.key === 'End') { e.preventDefault(); ctx.resizePair(handleIndex, bounds.max); }
        else if (e.key === 'Enter') { e.preventDefault(); ctx.resetSizes(); }
      }}
      {...rest}
    >
      {withGrip ? <span className="ui-resizable__grip" aria-hidden="true" /> : null}
    </div>
  );
});

const ResizableRoot = /* @__PURE__ */ React.forwardRef<HTMLDivElement, ResizableProps>(function Resizable(
  { orientation = 'horizontal', sizes: controlledSizes, defaultSizes, onSizesChange, className, children, ...rest },
  forwardedRef,
) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const childArray = React.Children.toArray(children);
  const bounds: Array<{ min: number; max: number }> = [];
  let panelCount = 0;
  let handleCount = 0;
  const indexedChildren = childArray.map((child) => {
    if (!React.isValidElement(child)) return child;
    if (child.type === ResizablePanel) {
      const p = child.props as ResizablePanelProps;
      bounds.push({ min: p.minSize ?? 10, max: p.maxSize ?? 90 });
      return React.cloneElement(child as React.ReactElement<ResizablePanelProps>, { 'data-panel-index': panelCount++ });
    }
    if (child.type === ResizableHandle) {
      return React.cloneElement(child as React.ReactElement<ResizableHandleProps>, { 'data-handle-index': handleCount++ });
    }
    return child;
  });

  const initialSizes = React.useMemo(
    () => (defaultSizes && defaultSizes.length === panelCount ? defaultSizes : Array.from({ length: Math.max(1, panelCount) }, () => 100 / Math.max(1, panelCount))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [panelCount],
  );
  const [sizes, setSizes] = useControllableState<number[]>(controlledSizes, initialSizes, onSizesChange);

  const boundsKey = bounds.map((b) => `${b.min}:${b.max}`).join(',');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableBounds = React.useMemo(() => bounds, [boundsKey]);

  const resizePair = React.useCallback(
    (handleIndex: number, desiredFirst: number) => {
      const a = sizes[handleIndex];
      const b = sizes[handleIndex + 1];
      if (a === undefined || b === undefined) return;
      const pairTotal = a + b;
      const bA = stableBounds[handleIndex] ?? { min: 10, max: 90 };
      const bB = stableBounds[handleIndex + 1] ?? { min: 10, max: 90 };
      const minA = Math.max(bA.min, pairTotal - bB.max);
      const maxA = Math.min(bA.max, pairTotal - bB.min);
      const clampedA = Math.max(minA, Math.min(maxA, Number(desiredFirst.toFixed(2))));
      const next = [...sizes];
      next[handleIndex] = clampedA;
      next[handleIndex + 1] = Number((pairTotal - clampedA).toFixed(2));
      setSizes(next);
    },
    [sizes, stableBounds, setSizes],
  );

  const resizeByDelta = React.useCallback(
    (handleIndex: number, deltaPct: number) => {
      resizePair(handleIndex, (sizes[handleIndex] ?? 50) + deltaPct);
    },
    [sizes, resizePair],
  );

  const resetSizes = React.useCallback(() => setSizes(initialSizes), [initialSizes, setSizes]);

  const ctx = React.useMemo<ResizableContextValue>(
    () => ({ orientation, sizes, bounds: stableBounds, resizePair, resizeByDelta, resetSizes, containerRef }),
    [orientation, sizes, stableBounds, resizePair, resizeByDelta, resetSizes],
  );

  return (
    <ResizableContext.Provider value={ctx}>
      <div
        ref={(el) => {
          containerRef.current = el;
          if (typeof forwardedRef === 'function') forwardedRef(el);
          else if (forwardedRef) forwardedRef.current = el;
        }}
        className={cx('ui-resizable', className)}
        data-orientation={orientation}
        {...rest}
      >
        {indexedChildren}
      </div>
    </ResizableContext.Provider>
  );
});

/**
 * Resizable split-pane container with pointer dragging and WAI-ARIA window-splitter keyboard controls.
 * Double-click or press Enter on a handle to reset to the default sizes.
 */
export const Resizable = /* @__PURE__ */ Object.assign(ResizableRoot, {
  Panel: ResizablePanel,
  Handle: ResizableHandle,
});
