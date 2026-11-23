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

let idCounter = 0;
/** Stable id helper for non-React contexts (React components should use React.useId). */
export const uniqueId = (prefix = 'ui') => `${prefix}-${++idCounter}`;
