import { useState } from 'react';
import { ApolloError, gql } from '@apollo/client';
import { motion } from 'framer-motion';
import { Cross, DrawOutlineRect, Loader, SearchIllustration } from '@shared/ui';
import { ExclamationTriangleIcon } from '@shared/assets';
import { ChatWithoutMessages, UserWithAvatar } from '@shared/types';
import { SearchUserItem } from './SearchUserItem';
import { useAddUserToChatMutation } from './search-result.generated';
import { SuccessMessage } from '@features';

const CHAT_BY_ID_QUERY = gql`
  query chatById($chatId: ID!) {
    chatById(chatId: $chatId) {
      id
      name
      userUuid
      isGroupChat
      groupAvatarUrl
      participants {
        id
        name
        avatarUrl
      }
      createdAt
    }
  }
`;

interface SearchResultProps {
  searchValue: string;
  searchData: UserWithAvatar[] | null;
  searchLoading: boolean;
  searchError: ApolloError | undefined;
  setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
  chat: ChatWithoutMessages;
}

export const SearchResult = ({
  searchValue,
  searchData,
  searchLoading,
  searchError,
  setIsSearch,
  chat,
}: SearchResultProps) => {
  const [successMessage, setSuccessMessage] = useState<string[]>([]);
  const [addUserToChat, { loading }] = useAddUserToChatMutation({
    update(cache, { data }) {
      if (!data?.addUserToChat) return;
      const updatedChat = data.addUserToChat;
      cache.writeQuery({
        query: CHAT_BY_ID_QUERY,
        data: { chatById: updatedChat },
        variables: { chatId: updatedChat.id },
        overwrite: true,
      });
    },
  });

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
    <>
      {loading && <Loader />}
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
                  <SearchUserItem
                    resultUser={user}
                    chat={chat as ChatWithoutMessages}
                    addUserToChat={addUserToChat}
                    setSuccessMessage={setSuccessMessage}
                  />
                </DrawOutlineRect>
              </motion.div>
            ))}
          </>
        )}
      </div>
      {successMessage.length > 0 && (
        <SuccessMessage
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
        />
      )}
    </>
  );
};
