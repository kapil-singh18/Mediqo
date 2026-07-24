import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#5F6FFF] text-white hover:bg-[#4d5ceb] focus:ring-[#5F6FFF] shadow-md shadow-blue-500/10 active:scale-[0.98]',
    secondary: 'bg-[#5F6FFF]/10 text-[#5F6FFF] hover:bg-[#5F6FFF]/15 focus:ring-[#5F6FFF] border border-[#5F6FFF]/20',
    outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-[#5F6FFF] hover:border-slate-300 focus:ring-[#5F6FFF]',
    ghost: 'text-slate-600 hover:bg-slate-100/80 hover:text-[#5F6FFF]',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-md shadow-red-500/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

