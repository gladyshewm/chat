import { ApolloError } from '@apollo/client';
import { motion } from 'framer-motion';
import { UserWithAvatar } from '@shared/types';
import {
  DrawOutlineRect,
  NoUsersIllustration,
  SearchIllustration,
} from '@shared/ui';
import { ExclamationTriangleIcon, UserIcon } from '@shared/assets';

interface SearchProps {
  searchValue: string;
  searchData: UserWithAvatar[] | null;
  searchLoading: boolean;
  searchError: ApolloError | undefined;
  setSelectedUsers: React.Dispatch<React.SetStateAction<UserWithAvatar[]>>;
}

export const SearchUsersForChat = ({
  searchValue,
  searchData,
  searchLoading,
  searchError,
  setSelectedUsers,
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
        <NoUsersIllustration />
        <p>Пользователи не найдены</p>
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
                <SearchResultUser
                  resultUser={user}
                  setSelectedUsers={setSelectedUsers}
                />
              </DrawOutlineRect>
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
};

interface SearchResultUserProps {
  resultUser: UserWithAvatar;
  setSelectedUsers: React.Dispatch<React.SetStateAction<UserWithAvatar[]>>;
}

const SearchResultUser = ({
  resultUser,
  setSelectedUsers,
}: SearchResultUserProps) => {
  const handleClick = async () => {
    setSelectedUsers((prev) => {
      if (prev.some((user) => user.id === resultUser.id)) return prev;
      return [...prev, resultUser];
    });
  };

  return (
    <div className="search-list-block" onClick={handleClick}>
      <div className="user-result">
        <DrawOutlineRect className="avatar-wrapper" strokeWidth={1} rx="50%">
          {resultUser.avatarUrl ? (
            <div className="user-avatar">
              <img src={resultUser.avatarUrl} alt={resultUser.name} />
            </div>
          ) : (
            <div className="empty-avatar">
              <UserIcon />
            </div>
          )}
        </DrawOutlineRect>
        <span className="user-name">{resultUser.name}</span>
      </div>
    </div>
  );
};
