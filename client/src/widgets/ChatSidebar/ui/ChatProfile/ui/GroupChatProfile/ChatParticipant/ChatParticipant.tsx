import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatParticipant.css';
import { AnimatePresence, motion } from 'framer-motion';
import { DrawOutlineRect, Loader } from '@shared/ui';
import { ChatWithoutMessages, UserWithAvatar } from '@shared/types';
import { EllipsisVerticalIcon, ExitIcon, UserIcon } from '@shared/assets';
import { useAuth } from '@app/providers/hooks/useAuth';
import {
  useChatWithUserQuery,
  useCreateChatMutation,
  useRemoveUserFromChatMutation,
} from './chat-participant.generated';
import { actionButtonVariants } from './motion';
import { gql } from '@apollo/client';

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

interface ChatParticipantProps {
  chat: ChatWithoutMessages;
  participant: UserWithAvatar;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ChatParticipant = ({
  chat,
  participant,
  setSuccessMessage,
}: ChatParticipantProps) => {
  const [isActionClicked, setIsActionClicked] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, loading, error } = useChatWithUserQuery({
    variables: {
      userUuid: participant.id,
    },
  });
  const [createChat] = useCreateChatMutation();
  const [removeUserFromChat, { loading: removeUserLoading }] =
    useRemoveUserFromChatMutation({
      fetchPolicy: 'no-cache',
      update(cache, { data }) {
        if (!data?.removeUserFromChat) return;
        const updatedChat = data.removeUserFromChat;
        cache.writeQuery({
          query: CHAT_BY_ID_QUERY, // Тот же запрос, который используется для получения чата в Chat
          data: { chatById: updatedChat },
          variables: { chatId: updatedChat.id },
          overwrite: true,
        });
      },
    });

  const handleClick = async () => {
    if (user?.uuid === participant.id) return;

    if (loading) return <Loader />;

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    if (data && data.chatWithUser) {
      navigate(`/chat/${data.chatWithUser.id}`);
    } else {
      try {
        const result = await createChat({
          variables: {
            participantsIds: [participant.id],
            name: null,
          },
        });

        navigate(`/chat/${result.data?.createChat?.id}`);
      } catch (error) {
        console.error('Не удалось создать чат', error);
        throw new Error(`Ошибка при создании чата: ${error.message}`);
      }
    }
  };

  const handleActionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsActionClicked(!isActionClicked);
  };

  const handleKickOutClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const { data } = await removeUserFromChat({
      variables: {
        chatId: chat.id,
        userUuid: participant.id,
      },
    });

    if (!data) {
      console.error('Не удалось удалить пользователя из чата');
      throw new Error('Не удалось удалить пользователя из чата');
    }

    setSuccessMessage((prev) => [
      ...prev,
      `Пользователь ${participant.name} исключён из чата`,
    ]);
  };

  return (
    <div className="chat-participant">
      {removeUserLoading && <Loader />}
      <div className="search-list-block" onClick={handleClick}>
        <div className="user-result">
          <DrawOutlineRect className="avatar-wrapper" strokeWidth={1} rx="50%">
            {participant.avatarUrl ? (
              <div className="user-avatar">
                <img src={participant.avatarUrl} alt={participant.name} />
              </div>
            ) : (
              <div className="empty-avatar">
                <UserIcon />
              </div>
            )}
          </DrawOutlineRect>
          <div className="user-info">
            <span className="user-name">{participant.name}</span>
            {chat.userUuid === participant.id ? (
              <span id="user-role">Создатель чата</span>
            ) : (
              chat.userUuid === user?.uuid && (
                <>
                  <button onClick={handleActionClick}>
                    <abbr title="Действия">
                      <EllipsisVerticalIcon />
                    </abbr>
                  </button>
                  <AnimatePresence mode="wait">
                    {isActionClicked && (
                      <motion.div
                        className="action-button"
                        key="actionButton"
                        variants={actionButtonVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div
                          className="action-button__text"
                          onClick={handleKickOutClick}
                        >
                          <ExitIcon />
                          <p>Исключить из чата</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
