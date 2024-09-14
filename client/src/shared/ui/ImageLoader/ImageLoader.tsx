import { ImgHTMLAttributes, useEffect, useState } from 'react';
import './ImageLoader.css';

interface ImageLoaderProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

export const ImageLoader = ({
  src,
  alt,
  className,
  ...props
}: ImageLoaderProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.src = src;
  }, [src]);

  return (
    <>
      {!imageLoaded && <div className="image-placeholder" />}
      <img
        src={src}
        alt={alt}
        className={`${className || ''} ${imageLoaded ? 'image-loaded' : 'image-loading'}`}
        style={{ display: imageLoaded ? 'block' : 'none' }}
        {...props}
      />
    </>
  );
};
