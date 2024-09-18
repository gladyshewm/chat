import { ApolloError } from '@apollo/client';
import { motion } from 'framer-motion';
import './Search.css';
import { UserWithAvatar } from '@shared/types';
import { Cross, DrawOutlineRect, SearchIllustration } from '@shared/ui';
import { ExclamationTriangleIcon } from '@shared/assets';
import { SearchResultItem } from '@features';

interface SearchProps {
  searchValue: string;
  searchData: UserWithAvatar[] | null;
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
                <SearchResultItem resultUser={user} />
              </DrawOutlineRect>
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
};

export default renderSearchResults;
