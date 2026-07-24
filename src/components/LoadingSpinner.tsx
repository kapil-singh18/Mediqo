import React from 'react';
import { Stethoscope } from 'lucide-react';

export const LoadingSpinner: React.FC<{ fullScreen?: boolean; message?: string }> = ({
  fullScreen = false,
  message = 'Loading Mediqo System...',
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <Stethoscope className="w-6 h-6 text-blue-600 absolute" />
      </div>
      {message && <p className="text-sm font-medium text-gray-600 animate-pulse">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="fixed inset-0 bg-white/90 backdrop-blur-xs z-50 flex items-center justify-center">{content}</div>;
  }

  return content;
};
