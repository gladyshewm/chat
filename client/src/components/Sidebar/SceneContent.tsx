import React, { FC } from 'react';
import ProfileScene from './ProfileScene';
import MessagesList from './MessagesList/MessagesList';
import { User } from '../../hoc/AuthProvider';
import { ApolloError } from '@apollo/client';

interface SceneContentProps {
  user: User | null;
  avatarUrl: string;
  errorQueryAvatar: ApolloError | undefined;
  isProfileSettings: boolean;
  setIsProfileSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

const SceneContent: FC<SceneContentProps> = ({
  user,
  avatarUrl,
  errorQueryAvatar,
  isProfileSettings,
  setIsProfileSettings,
}) => {
  return !isProfileSettings ? (
    <ProfileScene
      user={user}
      avatarUrl={avatarUrl}
      errorQueryAvatar={errorQueryAvatar}
      setIsProfileSettings={setIsProfileSettings}
    />
  ) : (
    <></>
  );
};

export default SceneContent;
