import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatProfile.css';
import { AnimatePresence, motion } from 'framer-motion';
import { chatProfileVariants, deleteChatButtonVariants } from './motion';
import { DrawOutline, Loader, OptionButton } from '@shared/ui';
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  XmarkIcon,
} from '@shared/assets';
import SingleChatProfile from './SingleChatProfile/SingleChatProfile';
import GroupChatProfile from './GroupChatProfile/GroupChatProfile';
import SearchUsers from './SearchUsers/SearchUsers';
import { useChat } from '@pages/Chat/ctx/ChatContext';
import { useDeleteChatMutation } from './chat-profile.generated';
import { useAuth } from '@app/providers/hooks/useAuth';

interface ChatProfileProps {
  setIsChatInfo: (isChatInfo: boolean) => void;
}

const ChatProfile = ({ setIsChatInfo }: ChatProfileProps) => {
  const [isSearchUsers, setIsSearchUsers] = useState(false);
  const [isActionClicked, setIsActionClicked] = useState(false);
  const { chat } = useChat();
  const { user } = useAuth();
  const [deleteChat, { loading: deleteChatLoading }] = useDeleteChatMutation();
  const navigate = useNavigate();

  if (!chat) return null;

  const handleActionClick = () => {
    setIsActionClicked(!isActionClicked);
  };

  const handleDeleteChat = async () => {
    await deleteChat({
      variables: {
        chatId: chat.id,
      },
      update: (cache, { data }) => {
        const isDeleted = data?.deleteChat;
        if (!isDeleted) return;

        cache.modify({
          fields: {
            userChats(existingChats = [], { readField }) {
              return existingChats.filter(
                (chatRef: any) => readField('id', chatRef) !== chat.id,
              );
            },
          },
        });
      },
    });
    navigate('/');
  };

  return (
    <AnimatePresence>
      <DrawOutline
        key={'chat-profile'}
        className="search-messages__wrapper"
        orientation="vertical"
        position="left"
      >
        {deleteChatLoading && <Loader />}
        {isSearchUsers ? (
          <SearchUsers setIsSearch={setIsSearchUsers} chat={chat} />
        ) : (
          <>
            <DrawOutline orientation="horizontal" position="bottom">
              <motion.header
                className="chat-profile__header"
                variants={chatProfileVariants}
                initial="hidden"
                animate="visible"
              >
                <OptionButton
                  className="close-button"
                  onClick={() => setIsChatInfo(false)}
                >
                  <abbr title="Закрыть">
                    <XmarkIcon />
                  </abbr>
                </OptionButton>
                <div className="chat-profile__title">
                  <p>Информация</p>
                </div>
                {chat.isGroupChat && chat.userUuid === user?.uuid && (
                  <>
                    <OptionButton className="close-button">
                      <abbr title="Редактировать профиль чата">
                        <PencilIcon />
                      </abbr>
                    </OptionButton>
                    <OptionButton
                      className="close-button action"
                      onClick={handleActionClick}
                    >
                      <abbr title="Действия">
                        <EllipsisVerticalIcon />
                      </abbr>
                    </OptionButton>
                    <AnimatePresence mode="wait">
                      {isActionClicked && (
                        <motion.div
                          className="action-button"
                          key="deleteChatButton"
                          variants={deleteChatButtonVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <div
                            className="action-button__text"
                            onClick={handleDeleteChat}
                          >
                            <TrashIcon />
                            <p>Удалить чат</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.header>
            </DrawOutline>
            {chat.isGroupChat ? (
              <GroupChatProfile
                isSearchUsers={isSearchUsers}
                setIsSearchUsers={setIsSearchUsers}
              />
            ) : (
              <SingleChatProfile />
            )}
          </>
        )}
      </DrawOutline>
    </AnimatePresence>
  );
};

export default ChatProfile;
