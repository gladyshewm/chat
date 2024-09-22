import { useEffect, useRef } from 'react';
import './MessagesListHeader.css';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
} from 'rxjs';
import { AnimatePresence, motion } from 'framer-motion';
import { DrawOutline, DrawOutlineRect, SearchInput } from '@shared/ui';
import { useProfile } from '@app/providers/hooks/useProfile';
import {
  avatarVariants,
  backButtonVariants,
  searchInputVariants,
} from '../motion';
import { ArrowLeftIcon, UserIcon } from '@shared/assets';
import { UserWithAvatar } from '@shared/types';

interface MessagesListHeaderProps {
  isSearch: boolean;
  setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setIsProfileSettings: React.Dispatch<React.SetStateAction<boolean>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setSearchData: React.Dispatch<React.SetStateAction<UserWithAvatar[] | null>>;
  findUsers: (variables: any) => Promise<any>;
}

const MessagesListHeader = ({
  isSearch,
  setIsSearch,
  setIsProfileSettings,
  searchValue,
  setSearchValue,
  setSearchData,
  findUsers,
}: MessagesListHeaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { avatarUrl, errorQueryAvatar } = useProfile();

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
  }, [findUsers, searchValue, setSearchData, setSearchValue]);

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

  return (
    <DrawOutline orientation="horizontal" position="bottom">
      <header className="message-list__header">
        <AnimatePresence initial={false}>
          <DrawOutlineRect className="avatar-wrapper" rx="50%">
            {isSearch ? (
              <motion.div
                key="backButton"
                onClick={handleBackClick}
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
              <SearchInput
                ref={inputRef}
                className="search-input"
                onClick={() => setIsSearch(true)}
              />
            </DrawOutlineRect>
          </motion.div>
        </AnimatePresence>
      </header>
    </DrawOutline>
  );
};

export default MessagesListHeader;
