import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = '', checked, disabled, id, ...props }, ref) => {
    const defaultId = React.useId();
    const inputId = id || defaultId;

    return (
      <div className="flex items-start gap-2.5 select-none">
        <div className="relative flex items-center justify-center pt-0.5">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            checked={checked}
            disabled={disabled}
            className={`peer appearance-none w-4 h-4 rounded-[4px] border border-slate-300 bg-white checked:bg-[#5F6FFF] checked:border-[#5F6FFF] focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]/20 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all cursor-pointer ${className}`}
            {...props}
          />
          <Check className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3]" />
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

Checkbox.displayName = 'Checkbox';
