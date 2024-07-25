import React, { FC } from 'react';
import ProfileScene from './ProfileScene';
import MessagesList from './MessagesList/MessagesList';
import { ApolloError } from '@apollo/client';
import { UserInfo } from '../../types.generated';

interface SceneContentProps {
  user: UserInfo | null;
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
