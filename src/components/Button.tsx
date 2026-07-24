import React from 'react';
import { Button as UIButton, ButtonProps as UIButtonProps } from './ui/Button';

export interface ButtonProps extends UIButtonProps {}

export const Button: React.FC<ButtonProps> = (props) => {
  return <UIButton {...props} />;
};


