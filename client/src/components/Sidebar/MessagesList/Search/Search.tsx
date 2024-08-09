import React, { FC } from 'react';
import { ApolloError } from '@apollo/client';
import { motion } from 'framer-motion';
import './Search.css';
import { UserWithAvatar } from '../../../../types.generated';
import Cross from './Cross/Cross';
import SearchIllustration from './SearchIllustration/SearchIllustration';
import UserIcon from '../../../../icons/UserIcon';
import ExclamationTriangleIcon from '../../../../icons/ExclamationTriangleIcon';
import DrawOutlineRect from '../../../DrawOutline/DrawOutlineRect/DrawOutlineRect';

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
            <motion.div
              key={user.id}
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
                <div className="search-list-block">
                  <div className="user-result">
                    {user.avatarUrl ? (
                      <DrawOutlineRect
                        className="avatar-wrapper"
                        strokeWidth={1}
                        rx="50%"
                      >
                        <div className="user-avatar">
                          <img src={user.avatarUrl} alt={user.name} />
                        </div>
                      </DrawOutlineRect>
                    ) : (
                      <DrawOutlineRect
                        className="avatar-wrapper"
                        strokeWidth={1}
                        rx="50%"
                      >
                        <div className="empty-avatar">
                          <UserIcon />
                        </div>
                      </DrawOutlineRect>
                    )}
                    <span className="user-name">{user.name}</span>
                  </div>
                </div>
              </DrawOutlineRect>
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
};

export default renderSearchResults;
