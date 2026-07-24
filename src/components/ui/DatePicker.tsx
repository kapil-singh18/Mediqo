import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, helperText, error, className = '', disabled, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative rounded-[10px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <input
            ref={ref}
            type="date"
            disabled={disabled}
            className={`w-full rounded-[10px] border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 transition-all duration-150 focus:border-[#5F6FFF] focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]/15 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
              error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/15' : ''
            } ${className}`}
            {...props}
          />
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

DatePicker.displayName = 'DatePicker';
