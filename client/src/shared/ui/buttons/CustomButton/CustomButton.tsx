import { ButtonHTMLAttributes, ReactNode } from 'react';
import './CustomButton.css';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export const CustomButton = ({
  children,
  className,
  ...props
}: CustomButtonProps) => {
  return (
    <button className={`custom-button ${className}`} {...props}>
      {children}
    </button>
  );
};
