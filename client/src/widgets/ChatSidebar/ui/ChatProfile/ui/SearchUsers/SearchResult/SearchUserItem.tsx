import { DrawOutlineRect } from '@shared/ui';
import { ChatWithoutMessages, UserWithAvatar } from '@shared/types';
import { UserIcon } from '@shared/assets';
import { useChat } from '@pages/Chat/providers/ChatProvider';

interface SearchResultChatUserProps {
  resultUser: UserWithAvatar;
  chat: ChatWithoutMessages;
  addUserToChat: any;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string[]>>;
}

export const SearchUserItem = ({
  resultUser,
  addUserToChat,
  setSuccessMessage,
}: SearchResultChatUserProps) => {
  const { chat } = useChat();

  if (!chat) return;

  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    try {
      await addUserToChat({
        variables: {
          chatId: chat.id,
          userUuid: resultUser.id,
        },
      });

      setSuccessMessage((prev) => [
        ...prev,
        `Пользователь ${resultUser.name} добавлен в чат`,
      ]);
    } catch (error) {
      throw new Error(
        `Ошибка при добавлении пользователя в чат: ${error.message}`,
      );
    }
  };

  return (
    <>
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
    </>
  );
};
