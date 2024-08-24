import { useState, ReactNode } from 'react';
import { Avatar, FullScreenContext } from './FullScreenContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const FullScreenProvider = ({ children }: AuthProviderProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentImage, setCurrentImage] = useState<Avatar | null>(null);
  const [images, setImages] = useState<Array<Avatar>>([]);
  const [headerContent, setHeaderContent] = useState<ReactNode | null>(null);
  const [canDeleteImage, setCanDeleteImage] = useState(false);
  const [deleteImage, setDeleteImage] = useState<() => void>(() => {});

  const openFullScreen = (
    newImages: Array<Avatar>,
    image: Avatar,
    newHeaderContent: ReactNode,
    newCanDeleteImage: boolean,
    deleteFunction?: (url: string) => void,
  ) => {
    setImages(newImages);
    setCurrentImage(image);
    setHeaderContent(newHeaderContent);
    setCanDeleteImage(newCanDeleteImage);
    setDeleteImage(() => deleteFunction || (() => {}));
    setIsFullScreen(true);
  };

  const removeImage = (url: string) => {
    setImages((prevImages) => prevImages.filter((img) => img.url !== url));
    if (currentImage && currentImage.url === url) {
      const nextIndex = images.findIndex((img) => img.url === url) + 1;
      setCurrentImage(images[nextIndex % images.length] || null);
    }
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    setCurrentImage(null);
    setHeaderContent(null);
  };

  return (
    <FullScreenContext.Provider
      value={{
        isFullScreen,
        currentImage,
        images,
        headerContent,
        canDeleteImage,
        deleteImage,
        removeImage,
        openFullScreen,
        closeFullScreen,
        setCurrentImage,
      }}
    >
      {children}
    </FullScreenContext.Provider>
  );
};
