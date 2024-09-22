import { useEffect, useRef, useState } from 'react';
import './AddChatParticipants.css';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
} from 'rxjs';
import { motion } from 'framer-motion';
import { DrawOutline, OptionButton, SearchInput } from '@shared/ui';
import { ArrowLeftIcon, UserIcon, XmarkIcon } from '@shared/assets';
import { UserWithAvatar } from '@shared/types';
import { useFindUsersLazyQuery } from '../../messagesList.generated';
import { SearchUsersForChat } from './SearchUsersForChat';
import { createChatButtonVariants } from '../../motion';

interface AddChatParticipantsProps {
  setIsCreateChat: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChatDescription: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUsers: UserWithAvatar[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<UserWithAvatar[]>>;
}

export const AddChatParticipants = ({
  setIsCreateChat,
  setIsChatDescription,
  selectedUsers,
  setSelectedUsers,
}: AddChatParticipantsProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState<UserWithAvatar[] | null>(null);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [findUsers, { loading: searchLoading, error: searchError }] =
    useFindUsersLazyQuery();

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
  }, [findUsers]);

  const handleBackClick = () => {
    setIsCreateChat(false);
  };

  const handleAddChatDescriptionClick = () => {
    setIsChatDescription(true);
  };

  return (
    <div id="create-chat">
      <DrawOutline orientation="horizontal" position="bottom">
        <header>
          <div className="title">
            <OptionButton className="back" onClick={handleBackClick}>
              <abbr title="Назад">
                <ArrowLeftIcon />
              </abbr>
            </OptionButton>
            <h2>Добавить участников</h2>
          </div>
          <div className="selected-users">
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="selected-user"
                onMouseEnter={() => setHoveredUserId(user.id)}
                onMouseLeave={() => setHoveredUserId(null)}
                onClick={() =>
                  setSelectedUsers((prev) =>
                    prev.filter((u) => u.id !== user.id),
                  )
                }
              >
                <div className="avatar">
                  {hoveredUserId === user.id ? (
                    <XmarkIcon />
                  ) : user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="avatar" />
                  ) : (
                    <UserIcon />
                  )}
                </div>
                <p className="user-name">{user.name}</p>
              </div>
            ))}
          </div>
          <SearchInput
            ref={inputRef}
            className="search-input"
            placeholder="Кого бы Вы хотели добавить?"
          />
        </header>
      </DrawOutline>
      <main>
        <SearchUsersForChat
          searchValue={searchValue}
          searchData={searchData}
          searchLoading={searchLoading}
          searchError={searchError}
          setSelectedUsers={setSelectedUsers}
        />
        <motion.button
          className="create-chat-button"
          key="create-chat-button"
          onClick={handleAddChatDescriptionClick}
          variants={createChatButtonVariants}
          initial="hidden"
          animate="animate"
          exit="exit"
          whileHover={
            selectedUsers.length === 0
              ? undefined
              : {
                  opacity: 1,
                  transition: { duration: 0.3 },
                }
          }
          disabled={selectedUsers.length === 0}
        >
          <abbr title="Перейти к описанию чата">
            <ArrowLeftIcon />
          </abbr>
        </motion.button>
      </main>
    </div>
  );
};
