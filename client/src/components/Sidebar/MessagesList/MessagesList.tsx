import React, { FC, useState } from 'react';
import UserIcon from '../../../icons/UserIcon';
import { ApolloError, useQuery } from '@apollo/client';
import './MessagesList.css';
import DrawOutlineRect from '../../DrawOutline/DrawOutlineRect/DrawOutlineRect';
import SearchIcon from '../../../icons/SearchIcon';
import { GET_USER_CHATS } from '../../../graphql/query/chats';
import { Link } from 'react-router-dom';

type ChatWithoutMessages = {
  id: string;
  name?: string;
  participants: UserWithAvatar[];
};

type UserWithAvatar = {
  id: string;
  name: string;
  avatarUrl?: string;
};

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
  const [chats, setChats] = useState<ChatWithoutMessages[]>([]);

  useQuery(GET_USER_CHATS, {
    onCompleted: (data) => {
      if (data) {
        setChats(data.userChats);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

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
        {chats.length === 0 ? (
          <p>No messages</p>
        ) : (
          chats.map((chat) => (
            <Link
              to={`/chat/${chat.id}`}
              key={chat.id}
              className="message-list-block"
            >
              <p>{chat.name}</p>
            </Link>
          ))
        )}
      </div>
    </>
  );
};

export default MessagesList;
