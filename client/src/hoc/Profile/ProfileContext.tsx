import { ApolloError } from '@apollo/client';
import { createContext } from 'react';
import { Avatar } from '../FullScreen/FullScreenContext';

interface ProfileContextType {
  avatarUrl: string | null;
  setAvatarUrl: React.Dispatch<React.SetStateAction<string | null>>;
  errorQueryAvatar: ApolloError | undefined;
  refetchQueryAvatar: () => void;
  allAvatars: Avatar[] | [];
  setAllAvatars: React.Dispatch<React.SetStateAction<Avatar[] | []>>;
  avatarUrls: string[] | [];
  handleDeleteAvatar: (url: string) => void;
  handleUploadAvatar: (avatar: File) => void;
}

export const ProfileContext = createContext<ProfileContextType>(
  {} as ProfileContextType,
);
