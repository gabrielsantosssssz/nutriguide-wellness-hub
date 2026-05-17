import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: string;
  inputId: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  inputId,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          className="font-label-md text-label-md text-on-surface"
          htmlFor={inputId}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{icon}</span>
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-surface-bright border rounded-lg font-body-md text-body-md text-on-surface py-3 transition-all duration-200
            ${icon ? 'pl-10 pr-3' : 'px-3'}
            ${error
              ? 'border-error focus:ring-2 focus:ring-error focus:border-error'
              : 'border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary'
            }
            focus:outline-none
            ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="font-body-sm text-body-sm text-error flex items-center gap-1" role="alert">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="font-body-sm text-body-sm text-on-surface-variant">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
