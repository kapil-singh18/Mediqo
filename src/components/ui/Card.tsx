import React from 'react';

// Base Card
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  hoverable = false,
  padding = 'md',
  children,
  className = '',
  ...props
}) => {
  const paddingMap = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-[12px] shadow-2xs transition-all duration-200 ${
        hoverable ? 'hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50' : ''
      } ${paddingMap[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Stat Card
export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  badgeText?: string;
  badgeType?: 'neutral' | 'success' | 'warning' | 'primary';
  action?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  badgeText,
  badgeType = 'primary',
  action,
  className = '',
}) => {
  const badgeStyles = {
    neutral: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100',
    primary: 'bg-[#F0F3FF] text-[#5F6FFF] border border-[#D6DDFF]',
  };

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2.5 rounded-[10px] bg-[#F0F3FF] text-[#5F6FFF] shrink-0">
              {icon}
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
            {badgeText && (
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${badgeStyles[badgeType]}`}>
                {badgeText}
              </span>
            )}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="mt-2">
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
      </div>
    </Card>
  );
};

// Section Card
export interface SectionCardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  action,
  children,
  padding = 'md',
  className = '',
}) => {
  return (
    <Card padding="none" className={className}>
      {(title || subtitle || action) && (
        <div className="px-5 py-4 sm:px-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            {title && <h3 className="text-base font-bold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={padding === 'none' ? 'p-0' : padding === 'sm' ? 'p-4' : padding === 'lg' ? 'p-6 sm:p-8' : 'p-5 sm:p-6'}>
        {children}
      </div>
    </Card>
  );
};

// Info Card
export interface InfoCardProps {
  title: string;
  items: Array<{ label: string; value: React.ReactNode; icon?: React.ReactNode }>;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, items, className = '' }) => {
  return (
    <Card className={className}>
      <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-3">{title}</h4>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              {item.icon && <span className="text-slate-400">{item.icon}</span>}
              {item.label}
            </span>
            <span className="text-slate-900 font-semibold text-right">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
