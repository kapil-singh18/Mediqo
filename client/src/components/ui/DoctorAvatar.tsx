import React from 'react';
import { Stethoscope } from 'lucide-react';

interface DoctorAvatarProps {
  src?: string;
  name?: string;
  speciality?: string;
  className?: string;
}

export const DoctorAvatar: React.FC<DoctorAvatarProps> = ({
  src,
  name = 'Doctor',
  speciality,
  className = '',
}) => {
  const [hasError, setHasError] = React.useState(false);

  // If a valid custom photo url is provided and hasn't errored
  if (src && src.trim() !== '' && !hasError) {
    return (
      <div className={`relative overflow-hidden flex items-center justify-center bg-slate-100 ${className}`}>
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover object-top"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // Consistent, clean, healthcare-friendly avatar icon
  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-gradient-to-b from-[#EEF2FF] to-[#D6DDFF] text-[#5F6FFF] overflow-hidden select-none border border-[#5F6FFF]/20 shadow-xs ${className}`}
    >
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-2">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#5F6FFF] flex items-center justify-center shadow-xs border border-indigo-100 mb-1 shrink-0">
          <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
        </div>
        <span className="text-[11px] font-extrabold text-slate-800 tracking-wide uppercase truncate max-w-[140px] leading-tight">
          {name.startsWith('Dr.') ? name : `Dr. ${name}`}
        </span>
        {speciality && (
          <span className="text-[10px] text-[#5F6FFF] font-semibold truncate max-w-[130px]">
            {speciality}
          </span>
        )}
      </div>
      {/* Decorative subtle medical geometry */}
      <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-[#5F6FFF]/10 blur-xs pointer-events-none" />
    </div>
  );
};
