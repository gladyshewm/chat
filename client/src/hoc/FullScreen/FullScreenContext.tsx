import { createContext, ReactNode } from 'react';

export interface Avatar {
  url: string;
  name: string;
  createdAt: string;
}

interface FullScreenContextType {
  isFullScreen: boolean;
  currentImage: Avatar | null;
  images: Array<Avatar>;
  headerContent: ReactNode | null;
  openFullScreen: (
    images: Array<Avatar>,
    currentImage: Avatar,
    headerContent: ReactNode,
    canDeleteImage: boolean,
    deleteImage: (url: string) => void,
  ) => void;
  canDeleteImage: boolean;
  deleteImage: (url: string) => void;
  removeImage: (url: string) => void;
  closeFullScreen: () => void;
  setCurrentImage: (image: Avatar) => void;
}

export const FullScreenContext = createContext<FullScreenContextType>(
  {} as FullScreenContextType,
);
