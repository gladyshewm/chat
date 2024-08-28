import { ApolloError, ApolloQueryResult } from '@apollo/client';
import { createContext } from 'react';
import { UserAvatarQuery } from './profile.generated';
import { ChangeCredentialsSchema } from '../../../features/auth/model/validation/validationSchemas';
import { AvatarInfo } from '@shared/types';

interface ProfileContextType {
  avatarUrl: string | null;
  setAvatarUrl: React.Dispatch<React.SetStateAction<string | null>>;
  errorQueryAvatar: ApolloError | undefined;
  refetchQueryAvatar: () => Promise<ApolloQueryResult<UserAvatarQuery>>;
  allAvatars: AvatarInfo[] | [];
  setAllAvatars: React.Dispatch<React.SetStateAction<AvatarInfo[] | []>>;
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
