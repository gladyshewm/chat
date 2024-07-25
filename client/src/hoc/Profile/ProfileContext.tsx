import { ApolloError, ApolloQueryResult } from '@apollo/client';
import { createContext } from 'react';
import { Avatar } from '../FullScreen/FullScreenContext';
import { ChangeCredentialsSchema } from '../../utils/validationSchemas';
import { UserAvatarQuery } from './profile.generated';

interface ProfileContextType {
  avatarUrl: string | null;
  setAvatarUrl: React.Dispatch<React.SetStateAction<string | null>>;
  errorQueryAvatar: ApolloError | undefined;
  refetchQueryAvatar: () => Promise<ApolloQueryResult<UserAvatarQuery>>;
  allAvatars: Avatar[] | [];
  setAllAvatars: React.Dispatch<React.SetStateAction<Avatar[] | []>>;
  avatarUrls: string[] | [];
  handleDeleteAvatar: (url: string) => void;
  handleUploadAvatar: (avatar: File) => void;
  handleChangeCredentials: (
    values: ChangeCredentialsSchema,
  ) => Promise<string[] | null>;
  profileLoadingStates: {
    deleteAvatar: boolean;
    uploadAvatar: boolean;
    changeCredentials: boolean;
    profileData: boolean;
  };
}

export const ProfileContext = createContext<ProfileContextType>(
  {} as ProfileContextType,
);
