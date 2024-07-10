import React, { FC } from 'react';
import UserIcon from '../../../icons/UserIcon';
import { ApolloError } from '@apollo/client';
import './MessagesList.css';

interface MessagesListProps {
  avatarUrl: string | null;
  errorQueryAvatar: ApolloError | undefined;
  setIsProfileSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

const MessagesList: FC<MessagesListProps> = ({
  avatarUrl,
  errorQueryAvatar,
  setIsProfileSettings,
}) => {
  const handleAvatarClick = () => {
    setIsProfileSettings(true);
  };

  return (
    <>
      <div className="message-list__header">
        <div onClick={handleAvatarClick} className="avatar">
          {errorQueryAvatar || !avatarUrl ? (
            <UserIcon />
          ) : (
            <img src={avatarUrl} alt="avatar" />
          )}
        </div>
        <input type="text" />
      </div>
      <div className="message-list">
        <h2>Messages</h2>
        <p>Your messages will appear here.</p>
      </div>
    </>
  );
};

export default MessagesList;
