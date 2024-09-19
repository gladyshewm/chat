import { useEffect, useRef, useState } from 'react';
import './SearchUsers.css';
import {
  DrawOutline,
  DrawOutlineRect,
  OptionButton,
  SearchInput,
} from '@shared/ui';
import { ArrowLeftIcon } from '@shared/assets';
import { ChatWithoutMessages, UserWithAvatar } from '@shared/types';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
} from 'rxjs';
import { SearchResult } from './SearchResult/SearchResult';
import { useFindUsersLazyQuery } from './search-users.generated';

interface SearchUsersProps {
  setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
  chat: ChatWithoutMessages;
}

const SearchUsers = ({ setIsSearch, chat }: SearchUsersProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState<UserWithAvatar[] | null>(null);
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
  }, [findUsers, searchValue]);

  return (
    <div className="search-users">
      <DrawOutline orientation="horizontal" position="bottom">
        <header className="message-list__header">
          <OptionButton onClick={() => setIsSearch(false)}>
            <abbr title="Назад">
              <ArrowLeftIcon />
            </abbr>
          </OptionButton>
          <DrawOutlineRect className="search-input-wrapper" rx={20}>
            <SearchInput ref={inputRef} className="search-input" />
          </DrawOutlineRect>
        </header>
      </DrawOutline>
      <SearchResult
        searchValue={searchValue}
        searchData={searchData}
        searchLoading={searchLoading}
        searchError={searchError}
        setIsSearch={setIsSearch}
        chat={chat}
      />
    </div>
  );
};

export default SearchUsers;
