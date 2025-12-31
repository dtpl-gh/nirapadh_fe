'use client';

import * as React from 'react';
import { Input } from './input';
import { Label } from './label';
import { cn } from '@/lib/utils';

export interface EmailInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
  showLabel?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  (
    {
      label,
      error,
      onChange,
      showLabel = false,
      onValidationChange,
      className,
      value,
      ...props
    },
    ref
  ): React.ReactElement => {
    const [validationError, setValidationError] = React.useState('');
    const [isTouched, setIsTouched] = React.useState(false);

    const isValidEmail = React.useMemo(() => {
      if (!value) return false;
      return EMAIL_REGEX.test(String(value).toLowerCase());
    }, [value]);

    React.useEffect(() => {
      if (onValidationChange) {
        onValidationChange(isValidEmail);
      }
    }, [isValidEmail, onValidationChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (onChange) {
        onChange(newValue);
      }

      if (isTouched) {
        if (!newValue) {
          setValidationError('');
        } else if (!EMAIL_REGEX.test(newValue.toLowerCase())) {
          setValidationError('Please enter a valid email address');
        } else {
          setValidationError('');
        }
      }
    };

    const handleBlur = () => {
      setIsTouched(true);
      if (value) {
        if (!EMAIL_REGEX.test(String(value).toLowerCase())) {
          setValidationError('Please enter a valid email address');
        } else {
          setValidationError('');
        }
      }
    };

    const displayError = error || validationError;

    return (
      <div className="space-y-2 w-full">
        {showLabel && label && <Label htmlFor={props.id}>{label}</Label>}
        <div className="relative">
          <Input
            ref={ref}
            type="email"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(
              isValidEmail && isTouched ? 'border-green-500' : 'border-gray-300',
              className
            )}
            {...props}
          />
          {isTouched && value && (
            <span className={`absolute right-3 top-2 ${isValidEmail ? 'text-green-500' : 'text-red-500'}`}>
              {isValidEmail ? '✓' : '✗'}
            </span>
          )}
        </div>
        {displayError && <p className="text-sm text-red-500">{displayError}</p>}
      </div>
    );
  }
);

EmailInput.displayName = 'EmailInput';

export { EmailInput };


