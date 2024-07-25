import React, { FC, useEffect, useRef, useState } from 'react';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
} from 'rxjs';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import './MessagesList.css';
import { useProfile } from '../../../hooks/useProfile';
import useAuth from '../../../hooks/useAuth';
import {
  useFindUsersLazyQuery,
  useUserChatsLazyQuery,
} from './messagesList.generated';
import { ChatWithoutMessages, UserWithAvatar } from '../../../types.generated';
import DrawOutlineRect from '../../DrawOutline/DrawOutlineRect/DrawOutlineRect';
import UserIcon from '../../../icons/UserIcon';
import SearchIcon from '../../../icons/SearchIcon';
import ArrowLeftIcon from '../../../icons/ArrowLeftIcon';
import {
  avatarVariants,
  backButtonVariants,
  searchInputVariants,
} from '../../../motion';
import DrawOutline from '../../DrawOutline/DrawOutline/DrawOutline';
import renderChats from './Chats/Chats';
import renderSearchResults from './Search/Search';

interface MessagesListProps {
  setIsProfileSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

const MessagesList: FC<MessagesListProps> = ({ setIsProfileSettings }) => {
  const [chats, setChats] = useState<ChatWithoutMessages[] | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [searchData, setSearchData] = useState<UserWithAvatar[] | null>(null);
  const { avatarUrl, errorQueryAvatar } = useProfile();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const inputRef = useRef<HTMLInputElement>(null);

  const [findUsers, { loading: searchLoading, error: searchError }] =
    useFindUsersLazyQuery();
  const [userChatsQuery, { error: chatsError, loading: chatsLoading }] =
    useUserChatsLazyQuery();

  useEffect(() => {
    const fetchUserChat = async () => {
      const { data: chatsData } = await userChatsQuery({});

      if (chatsError) {
        console.error(chatsError);
      }

      if (chatsData) {
        setChats(chatsData.userChats as ChatWithoutMessages[]);
      }
    };

    fetchUserChat();
  }, [userChatsQuery, chatsError]);

  const handleAvatarClick = () => {
    setIsProfileSettings(true);
  };

  const handleBackClick = () => {
    setIsSearch(false);
    setSearchValue('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  useEffect(() => {
    const handleSearch = async (value: string) => {
      setSearchValue(value);

      if (value.trim()) {
        const { data: searchData } = await findUsers({
          variables: {
            input: value.trim(),
          },
        });

        setSearchData(searchData?.findUsers as UserWithAvatar[]);
      }
    };

    if (inputRef.current) {
      const search$ = fromEvent(inputRef.current, 'input').pipe(
        map((event: Event) => (event.target as HTMLInputElement).value),
        debounceTime(500),
        distinctUntilChanged(),
        filter((value) => value.trim().length > 0 || value === ''),
      );

      const subscription = search$.subscribe(handleSearch);

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [findUsers, searchValue]);

  return (
    <>
      <DrawOutline orientation="horizontal" position="bottom">
        <div className="message-list__header">
          <AnimatePresence initial={false}>
            <DrawOutlineRect className="avatar-wrapper" rx="50%">
              {isSearch ? (
                <motion.div
                  key="backButton"
                  onClick={() => handleBackClick()}
                  className="back-button"
                  variants={backButtonVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <ArrowLeftIcon />
                </motion.div>
              ) : (
                <motion.div
                  key="avatar"
                  onClick={handleAvatarClick}
                  className="avatar"
                  variants={avatarVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {errorQueryAvatar || !avatarUrl ? (
                    <UserIcon />
                  ) : (
                    <img src={avatarUrl} alt="avatar" />
                  )}
                </motion.div>
              )}
            </DrawOutlineRect>
            <motion.div
              key="searchInput"
              className="search-input-block"
              variants={searchInputVariants}
              animate={isSearch ? 'visible' : 'hidden'}
            >
              <DrawOutlineRect className="search-input-wrapper" rx={20}>
                <div className="search-input-container">
                  <input
                    ref={inputRef}
                    className="search-input"
                    type="text"
                    placeholder=" "
                    onClick={() => setIsSearch(true)}
                  />
                  <SearchIcon />
                </div>
              </DrawOutlineRect>
            </motion.div>
          </AnimatePresence>
        </div>
      </DrawOutline>
      {isSearch ? (
        renderSearchResults({
          searchValue,
          searchData,
          searchLoading,
          searchError,
        })
      ) : (
        <div className="message-list">
          {renderChats({
            user,
            chats,
            chatsLoading,
            chatsError,
            activeChatId: id,
          })}
        </div>
      )}
    </>
  );
};

export default MessagesList;
