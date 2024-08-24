import React, { ButtonHTMLAttributes } from 'react';
import './OptionButton.css';

interface OptionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const OptionButton = ({
  children,
  className = '',
  ...props
}: OptionButtonProps) => {
  return (
    <button className={`option-button ${className}`} {...props}>
      {children}
    </button>
  );
};
