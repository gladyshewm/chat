import { AvatarInfo } from '@shared/types';
import { createContext, ReactNode } from 'react';

export interface Avatar {
  url: string;
  name: string;
  createdAt: string;
}

interface FullScreenContextType {
  isFullScreen: boolean;
  currentImage: AvatarInfo | null;
  images: Array<AvatarInfo>;
  headerContent: ReactNode | null;
  openFullScreen: (
    images: Array<AvatarInfo>,
    currentImage: AvatarInfo,
    headerContent: ReactNode,
    canDeleteImage: boolean,
    deleteImage?: (url: string) => void,
  ) => void;
  canDeleteImage: boolean;
  deleteImage: (url: string) => void;
  removeImage: (url: string) => void;
  closeFullScreen: () => void;
  setCurrentImage: (image: AvatarInfo) => void;
}

export const FullScreenContext = createContext<FullScreenContextType>(
  {} as FullScreenContextType,
);
