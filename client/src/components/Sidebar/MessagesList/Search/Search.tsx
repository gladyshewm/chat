import React, { FC } from 'react';
import { ApolloError } from '@apollo/client';
import './Search.css';
import { UserWithAvatar } from '../../../../types.generated';
import Cross from './Cross/Cross';
import SearchIllustration from './SearchIllustration/SearchIllustration';
import UserIcon from '../../../../icons/UserIcon';
import ExclamationTriangleIcon from '../../../../icons/ExclamationTriangleIcon';

interface SearchProps {
  searchValue: string;
  searchData: UserWithAvatar[] | null;
  searchLoading: boolean;
  searchError: ApolloError | undefined;
}

const renderSearchResults: FC<SearchProps> = ({
  searchValue,
  searchData,
  searchLoading,
  searchError,
}) => {
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
        <p>Пользователь не найден</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      {searchValue === '' ? (
        <div className="search-block">
          <SearchIllustration />
          <p>Введите имя пользователя</p>
        </div>
      ) : (
        <>
          {searchData?.map((user: UserWithAvatar) => (
            <div key={user.id} className="user-result">
              <div className="user-avatar">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} />
                ) : (
                  <UserIcon />
                )}
              </div>
              <span>{user.name}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default renderSearchResults;
