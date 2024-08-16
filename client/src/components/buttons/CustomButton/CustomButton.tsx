import React, { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import './CustomButton.css';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const CustomButton: FC<CustomButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button className={`custom-button ${className}`} {...props}>
      {children}
    </button>
  );
};

export default CustomButton;
