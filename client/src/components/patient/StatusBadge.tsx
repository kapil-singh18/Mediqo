import React from 'react';

export type StatusType = 'scheduled' | 'completed' | 'cancelled' | 'Paid' | 'Pending';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStyles = () => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'completed':
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200/60';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDotColor = () => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'completed':
      case 'paid':
        return 'bg-emerald-500';
      case 'cancelled':
        return 'bg-rose-500';
      case 'pending':
        return 'bg-amber-500';
      default:
        return 'bg-slate-400';
    }
  };

  const formatText = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs whitespace-nowrap ${getStyles()} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()} mr-1.5`} />
      {formatText(status)}
    </span>
  );
};
