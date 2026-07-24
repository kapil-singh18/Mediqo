import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      icon,
      leftIcon,
      rightIcon,
      startIcon,
      endIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const effectiveLeftIcon = leftIcon || startIcon || icon;
    const effectiveRightIcon = rightIcon || endIcon;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative rounded-[10px] shadow-2xs">
          {effectiveLeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {effectiveLeftIcon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={`w-full rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-150 focus:border-[#5F6FFF] focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]/15 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
              effectiveLeftIcon ? 'pl-10' : ''
            } ${effectiveRightIcon ? 'pr-10' : ''} ${
              error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/15' : ''
            } ${className}`}
            {...props}
          />
          {effectiveRightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
              {effectiveRightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

