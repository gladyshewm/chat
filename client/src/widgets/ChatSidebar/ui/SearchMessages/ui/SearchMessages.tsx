import { useCallback, useEffect, useRef, useState } from 'react';
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
  OptionButton,
  SearchIllustration,
  SearchInput,
} from '@shared/ui';
import { Message } from '@shared/types';
import { contentVariants } from './motion';
import { useFindMessagesLazyQuery } from './searchMessages.generated';
import { formatMessages } from '../utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ExclamationTriangleIcon, UserIcon, XmarkIcon } from '@shared/assets';
import { useChat } from '@pages/Chat/ctx/ChatContext';

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
  onMessageSelect: (messageId: string) => void;
}

const renderSearchResults = ({
  searchValue,
  searchData,
  searchLoading,
  searchError,
  onMessageSelect,
}: SearchProps) => {
  const handleMessageClick = (messageId: string) => {
    onMessageSelect(messageId);
  };

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
                  onClick={() => handleMessageClick(msg.id)}
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
  onMessageSelect: (messageId: string) => void;
  setIsSearch: (isSearch: boolean) => void;
}

const SearchMessages = ({
  onMessageSelect,
  setIsSearch,
}: SearchMessagesProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState<Message[] | null>(null);
  const [findMessages, { loading, error }] = useFindMessagesLazyQuery();
  const { chat } = useChat();

  const handleSearch = useCallback(
    async (value: string) => {
      setSearchValue(value);
      if (value) {
        try {
          const { data } = await findMessages({
            variables: {
              chatId: chat?.id as string,
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
    [findMessages, chat?.id],
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
  }, [handleSearch, chat?.id]);

  return (
    <AnimatePresence>
      <DrawOutline
        className="search-messages__wrapper"
        orientation="vertical"
        position="left"
      >
        <DrawOutline orientation="horizontal" position="bottom">
          <motion.header
            id="search-messages__header"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <OptionButton
              className="close-button"
              onClick={() => setIsSearch(false)}
            >
              <abbr title="Закрыть">
                <XmarkIcon />
              </abbr>
            </OptionButton>
            <DrawOutlineRect className="search-input-wrapper" rx={20}>
              <SearchInput ref={inputRef} />
            </DrawOutlineRect>
          </motion.header>
        </DrawOutline>
        <main className="search-messages__main">
          {renderSearchResults({
            searchValue,
            searchData,
            searchLoading: loading,
            searchError: error,
            onMessageSelect,
          })}
        </main>
      </DrawOutline>
    </AnimatePresence>
  );
};

export default SearchMessages;
