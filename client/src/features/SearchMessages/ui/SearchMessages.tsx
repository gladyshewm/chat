import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './SearchMessages.css';
import { ApolloError } from '@apollo/client';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
} from 'rxjs';
import {
  Cross,
  DrawOutline,
  DrawOutlineRect,
  ExclamationTriangleIcon,
  SearchIllustration,
  SearchInput,
  UserIcon,
} from '@shared/ui';
import { Message } from '@shared/types';
import { contentVariants, searchVariants } from './motion';
import { useFindMessagesLazyQuery } from './searchMessages.generated';
import { formatMessages } from '../utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const SearchResultItem = ({ message }: { message: Message }) => {
  return (
    <div className="search-list-block">
      <div className="user-result">
        {message.avatarUrl ? (
          <DrawOutlineRect className="avatar-wrapper" strokeWidth={1} rx="50%">
            <div className="user-avatar">
              <img src={message.avatarUrl} alt={message.userName} />
            </div>
          </DrawOutlineRect>
        ) : (
          <DrawOutlineRect className="avatar-wrapper" strokeWidth={1} rx="50%">
            <div className="empty-avatar">
              <UserIcon />
            </div>
          </DrawOutlineRect>
        )}
        <div className="user-result__content">
          <div className="top">
            <span className="user-name">{message.userName}</span>
            <span className="message-date">
              {format(new Date(message.createdAt), 'd MMM', {
                locale: ru,
              })}
            </span>
          </div>
          <span className="message-content">
            <p>{message.content}</p>
          </span>
        </div>
      </div>
    </div>
  );
};

interface SearchProps {
  searchValue: string;
  searchData: Message[] | null;
  searchLoading: boolean;
  searchError: ApolloError | undefined;
}

const renderSearchResults = ({
  searchValue,
  searchData,
  searchLoading,
  searchError,
}: SearchProps) => {
  if (searchValue !== '' && searchLoading) {
    return (
      <div className="search-block">
        <SearchIllustration />
        <p>Поиск...</p>
      </div>
    );
  }

  if (searchValue !== '' && searchError) {
    return (
      <div className="search-block">
        <ExclamationTriangleIcon className="search-error-icon" />
        <p>Ошибка: {searchError.message}</p>
      </div>
    );
  }

  if (searchValue !== '' && (!searchData || !searchData.length)) {
    return (
      <div className="search-block">
        <Cross className="search-cross" strokeWidth={18} />
        <p>Сообщение не найдено</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      {searchValue === '' ? (
        <div className="search-block">
          <SearchIllustration />
          <p>Введите сообщение</p>
        </div>
      ) : (
        <>
          {searchData && (
            <>
              <div className="count">
                <span>Найдено {formatMessages(searchData.length)}</span>
              </div>
              {searchData.map((msg: Message) => (
                <motion.div
                  key={msg.id}
                  className="search-result"
                  whileTap={{ scale: 0.95 }}
                >
                  <DrawOutlineRect
                    className="search-result-wrapper"
                    rx="15px"
                    stroke="#fff"
                    strokeWidth={1}
                    showOnHover={true}
                  >
                    <SearchResultItem message={msg} />
                  </DrawOutlineRect>
                </motion.div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

interface SearchMessagesProps {
  chatId: string;
}

const SearchMessages: FC<SearchMessagesProps> = ({ chatId }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState<Message[] | null>(null);
  const [findMessages, { loading, error }] = useFindMessagesLazyQuery();

  const handleSearch = useCallback(
    async (value: string) => {
      setSearchValue(value);
      if (value) {
        try {
          const { data } = await findMessages({
            variables: {
              chatId: chatId,
              query: value,
            },
          });
          setSearchData((data?.findMessages as Message[]) || null);
        } catch (err) {
          console.error('Error during search:', err);
          setSearchData(null);
        }
      } else {
        setSearchData(null);
      }
    },
    [findMessages, chatId],
  );

  useEffect(() => {
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
  }, [handleSearch, chatId]);

  return (
    <AnimatePresence>
      <motion.div
        key={'search'}
        className="search-messages"
        variants={searchVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <DrawOutline
          className="search-messages__wrapper"
          orientation="vertical"
          position="left"
        >
          <DrawOutline orientation="horizontal" position="bottom">
            <motion.div
              className="search-messages__header"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <DrawOutlineRect className="search-input-wrapper" rx={20}>
                <SearchInput ref={inputRef} />
              </DrawOutlineRect>
            </motion.div>
          </DrawOutline>
          <div className="search-messages__main">
            {renderSearchResults({
              searchValue,
              searchData,
              searchLoading: loading,
              searchError: error,
            })}
          </div>
        </DrawOutline>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchMessages;
