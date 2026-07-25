import React from 'react';
import { FolderOpen } from 'lucide-react';

export type EmptyStateIllustrationType = 
  | 'appointments' 
  | 'patients' 
  | 'prescriptions' 
  | 'bills' 
  | 'search' 
  | 'notifications' 
  | 'folder';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode | React.ComponentType<{ className?: string }> | any;
  illustrationType?: EmptyStateIllustrationType;
  actionButton?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

const RenderIllustration: React.FC<{ type?: EmptyStateIllustrationType }> = ({ type }) => {
  switch (type) {
    case 'appointments':
      return (
        <svg className="w-28 h-28 mx-auto" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#F0F3FF" />
          <rect x="35" y="38" width="50" height="48" rx="8" fill="white" stroke="#5F6FFF" strokeWidth="3" />
          <path d="M35 48H85" stroke="#D6DDFF" strokeWidth="2" />
          <circle cx="48" cy="32" r="4" fill="#5F6FFF" />
          <circle cx="72" cy="32" r="4" fill="#5F6FFF" />
          <path d="M48 28V36" stroke="#5F6FFF" strokeWidth="3" strokeLinecap="round" />
          <path d="M72 28V36" stroke="#5F6FFF" strokeWidth="3" strokeLinecap="round" />
          {/* Medical cross on calendar */}
          <rect x="56" y="58" width="8" height="18" rx="2" fill="#5F6FFF" />
          <rect x="51" y="63" width="18" height="8" rx="2" fill="#5F6FFF" />
          {/* Sparkle */}
          <circle cx="90" cy="30" r="3" fill="#10B981" />
        </svg>
      );

    case 'patients':
      return (
        <svg className="w-28 h-28 mx-auto" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#F0F3FF" />
          <circle cx="60" cy="48" r="16" fill="white" stroke="#5F6FFF" strokeWidth="3" />
          <path d="M36 82C36 68.7452 46.7452 58 60 58C73.2548 58 84 68.7452 84 82" stroke="#5F6FFF" strokeWidth="3" strokeLinecap="round" />
          <circle cx="60" cy="46" r="6" fill="#D6DDFF" />
          <rect x="74" y="32" width="16" height="16" rx="4" fill="#10B981" />
          <path d="M82 36V44M78 40H86" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'prescriptions':
      return (
        <svg className="w-28 h-28 mx-auto" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#F0F3FF" />
          <rect x="38" y="32" width="44" height="56" rx="6" fill="white" stroke="#5F6FFF" strokeWidth="3" />
          <path d="M48 44H72" stroke="#5F6FFF" strokeWidth="3" strokeLinecap="round" />
          <path d="M48 52H64" stroke="#D6DDFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M48 60H68" stroke="#D6DDFF" strokeWidth="2.5" strokeLinecap="round" />
          {/* Pill Capsule */}
          <rect x="58" y="68" width="24" height="12" rx="6" fill="#10B981" transform="rotate(-20 58 68)" />
          <path d="M68 64.5L72 75.5" stroke="white" strokeWidth="1.5" />
        </svg>
      );

    case 'bills':
      return (
        <svg className="w-28 h-28 mx-auto" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#F0F3FF" />
          <path d="M40 32H80V88L73.3 83.5L66.6 88L60 83.5L53.3 88L46.6 83.5L40 88V32Z" fill="white" stroke="#5F6FFF" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="60" cy="48" r="10" fill="#E0E7FF" />
          <text x="60" y="52" textAnchor="middle" fill="#5F6FFF" fontSize="12" fontWeight="bold" fontFamily="sans-serif">$</text>
          <path d="M48 64H72" stroke="#D6DDFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M48 72H64" stroke="#D6DDFF" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'search':
      return (
        <svg className="w-28 h-28 mx-auto" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#F0F3FF" />
          <circle cx="54" cy="54" r="22" fill="white" stroke="#5F6FFF" strokeWidth="3" />
          <path d="M70 70L86 86" stroke="#5F6FFF" strokeWidth="4" strokeLinecap="round" />
          {/* Stethoscope motif */}
          <path d="M46 54C46 58.4183 49.5817 62 54 62C58.4183 62 62 58.4183 62 54" stroke="#D6DDFF" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'notifications':
      return (
        <svg className="w-28 h-28 mx-auto" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#F0F3FF" />
          <path d="M60 34C48.9543 34 40 42.9543 40 54V66L34 74H86L80 66V54C80 42.9543 71.0457 34 60 34Z" fill="white" stroke="#5F6FFF" strokeWidth="3" strokeLinejoin="round" />
          <path d="M52 74C52 78.4183 55.5817 82 60 82C64.4183 82 68 78.4183 68 74" stroke="#5F6FFF" strokeWidth="3" strokeLinecap="round" />
          <circle cx="78" cy="38" r="6" fill="#EF4444" />
        </svg>
      );

    default:
      return (
        <svg className="w-28 h-28 mx-auto" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#F0F3FF" />
          <path d="M36 44C36 40.6863 38.6863 38 42 38H54L60 44H78C81.3137 44 84 46.6863 84 50V76C84 79.3137 81.3137 82 78 82H42C38.6863 82 36 79.3137 36 76V44Z" fill="white" stroke="#5F6FFF" strokeWidth="3" strokeLinejoin="round" />
          <path d="M52 60H68" stroke="#D6DDFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M52 68H62" stroke="#D6DDFF" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
  }
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Available',
  description = 'There are no records to display at this time.',
  icon,
  illustrationType,
  actionButton,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-slate-200/80 rounded-[16px] shadow-2xs my-4 ${className}`}
    >
      <div className="mb-4 shrink-0 transition-transform duration-300 hover:scale-105">
        {illustrationType ? (
          <RenderIllustration type={illustrationType} />
        ) : icon ? (
          <div className="p-4 rounded-2xl bg-[#F0F3FF] text-[#5F6FFF] shadow-xs">
            {React.isValidElement(icon) ? (
              icon
            ) : (
              React.createElement(icon as React.ComponentType<{ className?: string }>, { className: 'w-8 h-8' })
            )}
          </div>
        ) : (
          <RenderIllustration type="folder" />
        )}
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
      {description && (
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1.5 mb-5 leading-relaxed">
          {description}
        </p>
      )}

      {actionButton ? (
        <div>{actionButton}</div>
      ) : actionText && onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#5F6FFF] hover:bg-[#4F5FEF] transition-all shadow-md shadow-[#5F6FFF]/20 cursor-pointer"
        >
          {actionText}
        </button>
      ) : null}
    </div>
  );
};

