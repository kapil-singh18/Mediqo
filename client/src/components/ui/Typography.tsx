import React from 'react';

export const Display: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <h1 className={`text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight ${className}`}>
      {children}
    </h1>
  );
};

export const PageHeading: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <h1 className={`text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight ${className}`}>
      {children}
    </h1>
  );
};

export const SectionHeading: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <h2 className={`text-lg sm:text-xl font-bold text-slate-900 tracking-tight ${className}`}>
      {children}
    </h2>
  );
};

export const CardHeading: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <h3 className={`text-base font-bold text-slate-900 tracking-tight ${className}`}>
      {children}
    </h3>
  );
};

export const BodyText: React.FC<{ children: React.ReactNode; size?: 'sm' | 'md'; className?: string }> = ({
  children,
  size = 'md',
  className = '',
}) => {
  return (
    <p className={`${size === 'sm' ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'} text-slate-600 leading-relaxed ${className}`}>
      {children}
    </p>
  );
};

export const CaptionText: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <p className={`text-xs text-slate-500 font-medium ${className}`}>
      {children}
    </p>
  );
};
