import React from 'react';
import { LucideIcon, FolderOpen } from 'lucide-react';
import { Button } from '../Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderOpen,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm my-6 max-w-lg mx-auto space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-[#5F6FFF] flex items-center justify-center mx-auto shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">{description}</p>
      </div>
      {actionText && onAction && (
        <div className="pt-2">
          <Button onClick={onAction} className="bg-[#5F6FFF] hover:bg-[#4F5FEF] text-white rounded-full px-6 shadow-md shadow-indigo-100">
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
