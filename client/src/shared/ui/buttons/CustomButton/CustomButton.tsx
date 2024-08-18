import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import './CustomButton.css';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export const CustomButton: FC<CustomButtonProps> = ({
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
