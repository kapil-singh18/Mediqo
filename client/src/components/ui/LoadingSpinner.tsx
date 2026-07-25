import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  label?: string;
  message?: string;
  fullPage?: boolean;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  label,
  message,
  fullPage = false,
  fullScreen = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  const displayText = text || label || message;
  const isCentered = fullPage || fullScreen;

  const content = (
    <div className={`flex flex-col items-center justify-center p-6 space-y-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-[#5F6FFF] animate-spin`} />
      {displayText && <p className="text-xs font-semibold text-slate-500 tracking-wide">{displayText}</p>}
    </div>
  );

  if (isCentered) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
