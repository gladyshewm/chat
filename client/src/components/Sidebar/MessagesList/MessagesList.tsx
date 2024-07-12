import React, { FC } from 'react';
import UserIcon from '../../../icons/UserIcon';
import { ApolloError } from '@apollo/client';
import './MessagesList.css';
import DrawOutlineRect from '../../DrawOutline/DrawOutlineRect/DrawOutlineRect';
import SearchIcon from '../../../icons/SearchIcon';

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
        <DrawOutlineRect className="avatar-wrapper" rx="50%">
          <div onClick={handleAvatarClick} className="avatar">
            {errorQueryAvatar || !avatarUrl ? (
              <UserIcon />
            ) : (
              <img src={avatarUrl} alt="avatar" />
            )}
          </div>
        </DrawOutlineRect>
        <DrawOutlineRect className="search-input-wrapper" rx={20}>
          <div className="search-input-container">
            <input className="search-input" type="text" placeholder=" " />
            <SearchIcon />
          </div>
        </DrawOutlineRect>
      </div>
      <div className="message-list">
        <h2>Messages</h2>
        <p>Your messages will appear here.</p>
      </div>
    </>
  );
};

export default MessagesList;
