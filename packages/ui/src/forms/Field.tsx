import * as React from 'react';
import { cx } from '../utils';
import { DangerIcon } from '../icons';

export interface FieldContextValue {
  id: string;
  labelId: string;
  hintId?: string;
  errorId?: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

const FieldContext = /* @__PURE__ */ React.createContext<FieldContextValue | null>(null);

/** Read the surrounding Field's ids and state. Returns null outside a Field. */
export const useFieldContext = () => React.useContext(FieldContext);

/** Props a control spreads to link itself to its Field's label, hint and error. */
export function useFieldControlProps(own: { id?: string; 'aria-describedby'?: string } = {}) {
  const field = useFieldContext();
  if (!field) return { id: own.id, 'aria-describedby': own['aria-describedby'] };
  const describedBy = [own['aria-describedby'], field.hintId, field.errorId].filter(Boolean).join(' ') || undefined;
  return {
    id: own.id ?? field.id,
    'aria-describedby': describedBy,
    'aria-invalid': field.invalid || undefined,
    required: field.required || undefined,
    disabled: field.disabled || undefined,
  };
}

export interface FieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Visible label. */
  label?: React.ReactNode;
  /** Hide the label visually but keep it for screen readers. */
  hideLabel?: boolean;
  /** Help text under the control. */
  hint?: React.ReactNode;
  /** Error message; any value marks the field invalid. */
  error?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Id for the control. Generated if omitted. */
  id?: string;
  /** The control, or a render function receiving the ids to wire up custom controls. */
  children: React.ReactNode | ((ctx: FieldContextValue) => React.ReactNode);
  /** Extra content on the label row, e.g. a character count. */
  labelEnd?: React.ReactNode;
}

/** Wraps any control with a label, help text and error message, all linked for assistive tech. */
export const Field = /* @__PURE__ */ React.forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, hideLabel, hint, error, required = false, disabled = false, id: idProp, children, labelEnd, className, ...rest },
  ref,
) {
  const auto = React.useId();
  const id = idProp ?? `field-${auto}`;
  const invalid = Boolean(error);
  const ctx: FieldContextValue = {
    id,
    labelId: `${id}-label`,
    hintId: hint ? `${id}-hint` : undefined,
    errorId: invalid ? `${id}-error` : undefined,
    invalid,
    required,
    disabled,
  };
  return (
    <FieldContext.Provider value={ctx}>
      <div ref={ref} className={cx('ui-field', className)} data-invalid={invalid || undefined} data-disabled={disabled || undefined} {...rest}>
        {label ? (
          <div className={cx('ui-field__label-row', hideLabel && 'ui-visually-hidden')}>
            <label id={ctx.labelId} htmlFor={id} className="ui-field__label">
              {label}
              {/* The control's `required` attribute is what screen readers announce. */}
              {required ? <span className="ui-field__required" aria-hidden="true"> *</span> : null}
            </label>
            {labelEnd}
          </div>
        ) : null}
        {typeof children === 'function' ? children(ctx) : children}
        {hint ? (
          <p id={ctx.hintId} className="ui-field__hint">
            {hint}
          </p>
        ) : null}
        {invalid ? (
          <p id={ctx.errorId} className="ui-field__error">
            <DangerIcon size="sm" />
            <span>{error}</span>
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
});
