import * as React from 'react';
import { cx } from '../utils';
import { useLocale } from '../theme/ThemeProvider';
import { CheckIcon } from '../icons';

export interface StepperStep {
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLOListElement>, 'onChange'> {
  steps: StepperStep[];
  /** Index of the current step (0-based). Steps before it are complete. */
  current: number;
  /** Default `'horizontal'`. */
  orientation?: 'horizontal' | 'vertical';
  /** Lets people go back to a completed step. */
  onStepClick?: (index: number) => void;
}

/** Shows progress through a multi-step task such as checkout or onboarding. */
export const Stepper = /* @__PURE__ */ React.forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  { steps, current, orientation = 'horizontal', onStepClick, className, ...rest },
  ref,
) {
  const locale = useLocale();
  return (
    <ol ref={ref} className={cx('ui-stepper', className)} data-orientation={orientation} {...rest}>
      {steps.map((step, i) => {
        const status = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
        const body = (
          <>
            <span className="ui-stepper__indicator" aria-hidden="true">
              {status === 'complete' ? <CheckIcon size="sm" /> : i + 1}
            </span>
            <span className="ui-stepper__text">
              <span className="ui-stepper__title">{step.title}</span>
              {step.description ? <span className="ui-stepper__description">{step.description}</span> : null}
              <span className="ui-visually-hidden">, {locale.stepStatus[status]}</span>
            </span>
          </>
        );
        return (
          <li key={i} className="ui-stepper__step" data-status={status} aria-current={status === 'current' ? 'step' : undefined}>
            {onStepClick && status === 'complete' ? (
              <button type="button" className="ui-stepper__button" onClick={() => onStepClick(i)}>
                {body}
              </button>
            ) : (
              <span className="ui-stepper__button">{body}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
});
