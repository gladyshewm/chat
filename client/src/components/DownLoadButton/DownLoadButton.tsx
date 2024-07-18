import React, { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import './DownLoadButton.css';
import DocumentArrowDownIcon from '../../icons/DocumentArrowDownIcon';
import { Avatar } from '../../hoc/FullScreen/FullScreenContext';

interface DownLoadButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  image: Avatar;
  className?: string;
  children?: ReactNode;
}

const DownLoadButton: FC<DownLoadButtonProps> = ({
  image,
  className,
  children,
  ...props
}) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = image.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log('Error downloading image', error);
    }
  };

  return (
    <button
      className={className ? className : 'download-button'}
      onClick={handleDownload}
      {...props}
    >
      <DocumentArrowDownIcon />
      {children}
    </button>
  );
};

export default DownLoadButton;
