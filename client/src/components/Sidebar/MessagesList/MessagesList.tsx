import React, { FC, useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
} from 'rxjs';
import './MessagesList.css';
import UserIcon from '../../../icons/UserIcon';
import DrawOutlineRect from '../../DrawOutline/DrawOutlineRect/DrawOutlineRect';
import SearchIcon from '../../../icons/SearchIcon';
import { GET_USER_CHATS } from '../../../graphql/query/chats';
import { FIND_USERS } from '../../../graphql/query/user';
import { useProfile } from '../../../hooks/useProfile';
import useAuth from '../../../hooks/useAuth';

type ChatWithoutMessages = {
  id: string;
  name?: string;
  isGroupChat: boolean;
  groupAvatarUrl?: string;
  participants: UserWithAvatar[];
  createdAt: Date;
};

type UserWithAvatar = {
  id: string;
  name: string;
  avatarUrl?: string;
};

interface MessagesListProps {
  setIsProfileSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

const MessagesList: FC<MessagesListProps> = ({ setIsProfileSettings }) => {
  const [chats, setChats] = useState<ChatWithoutMessages[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const { avatarUrl, errorQueryAvatar } = useProfile();
  const { user } = useAuth();

  const [
    findUsers,
    { loading: searchLoading, error: searchError, data: searchData },
  ] = useLazyQuery(FIND_USERS);

  const {
    data: chatsData,
    error: chatsError,
    loading: chatsLoading,
  } = useQuery(GET_USER_CHATS, {
    onCompleted: (data) => {
      if (data) {
        setChats(data.userChats);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (chatsData) {
      setChats(chatsData.userChats);
    }
  }, [chatsData]);

  const handleAvatarClick = () => {
    setIsProfileSettings(true);
  };

  useEffect(() => {
    const handleSearch = (value: string) => {
      setSearchValue(value);
      if (value.trim()) {
        findUsers({
          variables: {
            input: value.trim(),
          },
        });
      }
    };

    const input = document.querySelector('.search-input') as HTMLInputElement;
    const search$ = fromEvent(input, 'input').pipe(
      map((event: Event) => (event.target as HTMLInputElement).value),
      debounceTime(500),
      distinctUntilChanged(),
      filter((value) => value.trim().length > 0 || value === ''),
    );

    const subscription = search$.subscribe(handleSearch);

    return () => {
      subscription.unsubscribe();
    };
  }, [findUsers, setSearchValue]);

  const renderSearchResults = () => {
    if (searchLoading) return <p>Searching...</p>;
    if (searchError) return <p>Error: {searchError.message}</p>;
    if (!searchData || !searchData.findUsers.length)
      return <p>No users found</p>;

    return (
      <div className="search-results">
        {searchData.findUsers.map((user: UserWithAvatar) => (
          <div key={user.id} className="user-result">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="user-avatar"
              />
            ) : (
              <UserIcon />
            )}
            <span>{user.name}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderChats = () => {
    if (chatsLoading) return <p>Loading...</p>;
    if (chatsError) return <p>Error</p>;
    if (!chats.length) return <p>No messages</p>;

    return chats.map((chat) => (
      <Link
        to={`/chat/${chat.id}`}
        key={chat.id}
        className="message-list-block"
      >
        {chat.isGroupChat ? (
          <>{chat.name}</>
        ) : (
          <>
            <div>
              {/* <img
                src={
                  chat.participants.filter(
                    (participant) => participant.id !== user?.uuid,
                  )[0].avatarUrl
                }
                alt=""
              /> */}
            </div>
            <p>
              {
                chat.participants.filter(
                  (participant) => participant.id !== user?.uuid,
                )[0].name
              }
            </p>
          </>
        )}
      </Link>
    ));
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
      {searchValue ? (
        renderSearchResults()
      ) : (
        <div className="message-list">{renderChats()}</div>
      )}
    </>
  );
};

export default MessagesList;
