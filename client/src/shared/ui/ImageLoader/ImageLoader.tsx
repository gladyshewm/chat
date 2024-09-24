import { ImgHTMLAttributes, useEffect, useState } from 'react';
import './ImageLoader.css';

interface ImageLoaderProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: number;
}

export const ImageLoader = ({
  src,
  alt,
  className,
  aspectRatio,
  ...props
}: ImageLoaderProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      setDimensions({ width: img.width, height: img.height });
    };
    /* img.onload = () => {
      setTimeout(() => {
        setImageLoaded(true);
        setDimensions({ width: img.width, height: img.height });
      }, 3330);
    }; */
    img.src = src;
  }, [src]);

  const placeholderStyle: React.CSSProperties = {
    paddingBottom: aspectRatio
      ? `${100 / aspectRatio}%`
      : `${(dimensions.height / dimensions.width) * 100}%`,
  };

  return (
    <div className="image-loader-container">
      {!imageLoaded && (
        <div className="image-placeholder" style={placeholderStyle} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className || ''} ${imageLoaded ? 'image-loaded' : 'image-loading'}`}
        style={{ display: imageLoaded ? 'block' : 'none' }}
        {...props}
      />
    </div>
  );
};
