import React, { ButtonHTMLAttributes, FC } from 'react';
import './OptionButton.css';

interface OptionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const OptionButton: FC<OptionButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <button className={`option-button ${className}`} {...props}>
      {children}
    </button>
  );
};

export default OptionButton;
