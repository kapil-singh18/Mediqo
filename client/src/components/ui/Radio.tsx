import React from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className = '', checked, disabled, id, ...props }, ref) => {
    const defaultId = React.useId();
    const inputId = id || defaultId;

    return (
      <div className="flex items-start gap-2.5 select-none">
        <div className="relative flex items-center justify-center pt-0.5">
          <input
            ref={ref}
            type="radio"
            id={inputId}
            checked={checked}
            disabled={disabled}
            className={`peer appearance-none w-4 h-4 rounded-full border border-slate-300 bg-white checked:border-[#5F6FFF] focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]/20 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all cursor-pointer ${className}`}
            {...props}
          />
          <div className="w-2 h-2 rounded-full bg-[#5F6FFF] absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        {(label || description) && (
          <label htmlFor={inputId} className="cursor-pointer">
            {label && <p className="text-sm font-medium text-slate-800">{label}</p>}
            {description && <p className="text-xs text-slate-500">{description}</p>}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
