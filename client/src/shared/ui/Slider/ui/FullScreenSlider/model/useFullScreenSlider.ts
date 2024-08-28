import { AvatarInfo } from '@shared/types';
import { useCallback, useState } from 'react';

export const useFullScreenSlider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<AvatarInfo | null>(null);
  const [images, setImages] = useState<AvatarInfo[]>([]);
  const [headerContent, setHeaderContent] = useState<React.ReactNode | null>(
    null,
  );

  const openSlider = useCallback(
    (
      newImages: AvatarInfo[],
      image: AvatarInfo,
      newHeaderContent: React.ReactNode,
    ) => {
      setImages(newImages);
      setCurrentImage(image);
      setHeaderContent(newHeaderContent);
      setIsOpen(true);
    },
    [],
  );

  const closeSlider = useCallback(() => {
    setIsOpen(false);
    setCurrentImage(null);
    setHeaderContent(null);
  }, []);

  const navigateSlider = useCallback(
    (direction: number) => {
      if (!currentImage) return;
      const currentIndex = images.indexOf(currentImage);
      const newIndex =
        (currentIndex + direction + images.length) % images.length;
      setCurrentImage(images[newIndex]);
    },
    [currentImage, images],
  );

  const removeImage = (url: string) => {
    setImages((prevImages) => prevImages.filter((img) => img.url !== url));
    if (currentImage && currentImage.url === url) {
      const nextIndex = images.findIndex((img) => img.url === url) + 1;
      setCurrentImage(images[nextIndex % images.length] || null);
    }
  };

  return {
    isOpen,
    currentImage,
    images,
    headerContent,
    openSlider,
    closeSlider,
    navigateSlider,
    setCurrentImage,
    removeImage,
  };
};
