import { FunctionComponent } from 'react';

export interface ButtonSpinnerProps {
  children?: string;
}

export const ButtonSpinner: FunctionComponent<ButtonSpinnerProps> = ({
  children,
}) => (
  <>
    <span
      className="spinner-border spinner-border-sm me-2"
      role="status"
      aria-hidden="true"
    ></span>
    {children && <span className="sr-only">{children}</span>}
  </>
);
