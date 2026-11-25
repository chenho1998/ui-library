import * as React from 'react';
export { clsx as cx } from 'clsx';

export type Size = 'sm' | 'md' | 'lg';
export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

/** Merge several refs into one callback ref. */
export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(value);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = value;
    }
  };
}

/** Manages a prop that can be either controlled (`value !== undefined`) or uncontrolled (`defaultValue`). */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T | (() => T),
  onChange?: (next: T) => void,
): readonly [T, (next: T) => void] {
  const [inner, setInner] = React.useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const onChangeRef = React.useRef(onChange);
  React.useLayoutEffect(() => {
    onChangeRef.current = onChange;
  });
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChangeRef.current?.(next);
    },
    [controlled],
  );
  return [current, set] as const;
}

let idCounter = 0;
/** Stable id helper for non-React contexts (React components should use React.useId). */
export const uniqueId = (prefix = 'ui') => `${prefix}-${++idCounter}`;
