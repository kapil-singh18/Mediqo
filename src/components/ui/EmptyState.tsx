import React from 'react';
import { FolderOpen } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Available',
  description = 'There are no records to display at this time.',
  icon,
  actionButton,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-slate-200/80 rounded-[12px] ${className}`}
    >
      <div className="p-3.5 rounded-2xl bg-[#F0F3FF] text-[#5F6FFF] mb-3 shrink-0">
        {icon || <FolderOpen className="w-8 h-8 stroke-[1.5]" />}
      </div>

      <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
      {description && <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">{description}</p>}

      {actionButton && <div className="mt-1">{actionButton}</div>}
    </div>
  );
};
