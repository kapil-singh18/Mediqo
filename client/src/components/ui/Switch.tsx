import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3 translate-x-0.5 peer-checked:translate-x-4',
    },
    md: {
      track: 'w-10 h-5',
      thumb: 'w-4 h-4 translate-x-0.5 peer-checked:translate-x-5',
    },
  };

  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={`${sizeClasses[size].track} bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#5F6FFF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-[#5F6FFF] transition-colors disabled:opacity-50`}
        />
        <div
          className={`absolute ${sizeClasses[size].thumb} bg-white rounded-full transition-transform duration-200 shadow-xs pointer-events-none`}
        />
      </div>
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-medium text-slate-800">{label}</p>}
          {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
      )}
    </label>
  );
};
