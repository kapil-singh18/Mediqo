import React from 'react';
import { Input as UIInput, InputProps as UIInputProps } from './ui/Input';

export interface InputProps extends UIInputProps {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <UIInput ref={ref} {...props} />;
});

Input.displayName = 'Input';

