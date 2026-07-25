import React from 'react';

export type BadgeVariant =
  | 'success'
  | 'pending'
  | 'warning'
  | 'danger'
  | 'cancelled'
  | 'completed'
  | 'primary'
  | 'neutral'
  | 'info';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  showDot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  showDot = true,
  children,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; dot: string }> = {
    success: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      dot: 'bg-emerald-500',
    },
    completed: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      dot: 'bg-emerald-500',
    },
    pending: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
      dot: 'bg-amber-500',
    },
    warning: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
      dot: 'bg-amber-500',
    },
    danger: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
      dot: 'bg-rose-500',
    },
    cancelled: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
      dot: 'bg-rose-500',
    },
    primary: {
      bg: 'bg-[#F0F3FF] text-[#5F6FFF] border-[#D6DDFF]',
      dot: 'bg-[#5F6FFF]',
    },
    info: {
      bg: 'bg-sky-50 text-sky-700 border-sky-200/60',
      dot: 'bg-sky-500',
    },
    neutral: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200/60',
      dot: 'bg-slate-400',
    },
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const currentVariant = variantStyles[variant] || variantStyles.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full border ${currentVariant.bg} ${sizeClasses[size]} whitespace-nowrap capitalize tracking-tight ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${currentVariant.dot} shrink-0`} />}
      <span>{children}</span>
    </span>
  );
};

// Convenient helper for standard status mapping
export const StatusBadge: React.FC<{ status: string; size?: 'sm' | 'md'; className?: string }> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const normalized = (status || '').toLowerCase();

  let variant: BadgeVariant = 'neutral';
  if (normalized.includes('completed') || normalized.includes('paid')) {
    variant = 'completed';
  } else if (normalized.includes('pending') || normalized.includes('scheduled')) {
    variant = 'pending';
  } else if (normalized.includes('cancelled') || normalized.includes('overdue')) {
    variant = 'cancelled';
  } else if (normalized.includes('in progress') || normalized.includes('active')) {
    variant = 'primary';
  }

  return (
    <Badge variant={variant} size={size} className={className}>
      {status}
    </Badge>
  );
};
