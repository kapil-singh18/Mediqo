import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: React.ChangeEventHandler<HTMLInputElement> | ((value: string) => void) | any;
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, className = '', placeholder = 'Search...', ...props }, ref) => {
    const hasValue = Boolean(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;
      if (typeof onChange === 'function') {
        onChange(e);
      }
    };

    return (
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full rounded-[10px] border border-slate-200 bg-white pl-10 pr-9 py-2 text-sm text-slate-900 placeholder-slate-400 transition-all duration-150 focus:border-[#5F6FFF] focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]/15 ${className}`}
          {...props}
        />
        {hasValue && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
