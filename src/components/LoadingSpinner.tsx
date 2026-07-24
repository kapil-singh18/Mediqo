import React from 'react';
import { LoadingSpinner as UILoadingSpinner } from './ui/LoadingSpinner';

export const LoadingSpinner: React.FC<{ fullScreen?: boolean; message?: string }> = ({
  fullScreen = false,
  message = 'Loading Mediqo System...',
}) => {
  return <UILoadingSpinner fullPage={fullScreen} text={message} />;
};

