import React, { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import './CustomButton.css';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const CustomButton: FC<CustomButtonProps> = ({ children, ...props }) => {
  return (
    <button className="custom-button" {...props}>
      {children}
    </button>
  );
};

export default CustomButton;
