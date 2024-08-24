import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './Chat.css';
import {
  useChatByIdLazyQuery,
  useSendMessageMutation,
  useSendTypingStatusMutation,
  useUserTypingSubscription,
} from './chat.generated';
import { ChatWithoutMessages, TypingFeedback, UserInfo } from '@shared/types';
import {
  DrawOutline,
  DrawOutlineRect,
  Loader,
  OptionButton,
  SpaceBackground,
} from '@shared/ui';
import {
  EllipsisVerticalIcon,
  PencilIcon,
  SearchIcon,
  UserGroupIcon,
  XmarkIcon,
} from '@shared/assets';
import { useAuth } from '@app/providers/hooks/useAuth';
import { MessageForm, Messages, SearchMessages } from '@features';
import { formatParticipants } from '../utils';
import { searchVariants } from 'features/SearchMessages/ui/motion';
import {
  chatContentVariants,
  chatFooterVariants,
  chatVariants,
} from './motion';

const Chat = () => {
  const { user } = useAuth();
  const { id: chat_id } = useParams<{ id: string }>();
  const [chat, setChat] = useState<ChatWithoutMessages | null>(null);
  const [postMessage] = useSendMessageMutation();
  const [chatQuery, { data, loading, error }] = useChatByIdLazyQuery();
  const [sendTypingStatus] = useSendTypingStatusMutation();
  const [typingStatus, setTypingStatus] = useState<TypingFeedback | null>(null);
  const [isSearch, setIsSearch] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );
  const navigate = useNavigate();

  useEffect(() => {
    chatQuery({
      variables: {
        chatId: chat_id as string,
      },
    });
  }, [chatQuery, chat_id]);

  useEffect(() => {
    if (data) setChat(data?.chatById as ChatWithoutMessages);
  }, [data]);

  const sendMessage = (message: string) => {
    if (chat_id && message) {
      postMessage({
        variables: {
          chatId: chat_id,
          content: message,
        },
      });
    }
  };

  useUserTypingSubscription({
    variables: {
      chatId: chat_id as string,
    },
    onData: (userTypingData) => {
      const typingStatus = userTypingData.data.data
        ?.userTyping as TypingFeedback;
      setTypingStatus(typingStatus);
    },
  });

  const handleKeyDown = () => {
    sendTypingStatus({
      variables: {
        chatId: chat_id as string,
        userName: user?.name as string,
        isTyping: true,
      },
    });
  };

  const handleBlur = () => {
    sendTypingStatus({
      variables: {
        chatId: chat_id as string,
        userName: user?.name as string,
        isTyping: false,
      },
    });
  };

  const handleFocus = () => {
    sendTypingStatus({
      variables: {
        chatId: chat_id as string,
        userName: user?.name as string,
        isTyping: true,
      },
    });
  };

  const handleCloseButton = () => {
    navigate('/');
  };

  const handleMessageSelect = (messageId: string) => {
    setSelectedMessageId(messageId);
  };

  if (error) return <div>{`Ошибка: ${error.message}`}</div>;

  return (
    <AnimatePresence mode="wait">
      <motion.div className="chat" key={chat_id} {...chatVariants}>
        <SpaceBackground />
        {!chat ? (
          <Loader />
        ) : (
          <motion.div
            key={chat.id}
            className={`chat-content ${isSearch ? 'reduced' : ''}`}
            variants={chatContentVariants}
            initial="fullWidth"
            animate={isSearch ? 'reduced' : 'full'}
            transition={{ duration: 0.3 }}
          >
            <DrawOutline orientation="horizontal" position="bottom">
              <motion.header className="chat__header">
                <motion.div className="main">
                  {chat.isGroupChat ? (
                    <>
                      <DrawOutlineRect className="avatar-wrapper" rx="50%">
                        <motion.div className="chat__avatar">
                          {chat.groupAvatarUrl ? (
                            <img
                              src={`${chat.groupAvatarUrl}`}
                              alt="chat-avatar"
                            />
                          ) : (
                            <UserGroupIcon />
                          )}
                        </motion.div>
                      </DrawOutlineRect>
                      <motion.div className="chat__info">
                        <span className="chat__name">{chat.name}</span>
                        <motion.div className="chat__count">
                          {formatParticipants(chat.participants.length)}
                        </motion.div>
                      </motion.div>
                    </>
                  ) : (
                    <></> // TODO: add user avatar
                  )}
                </motion.div>
                {typingStatus?.isTyping &&
                  typingStatus.userName !== user?.name && (
                    <motion.div className="feedback">
                      <span>{typingStatus.userName}...</span>
                      <PencilIcon />
                    </motion.div>
                  )}
                <motion.div className="buttons">
                  <OptionButton
                    className="search"
                    onClick={() => setIsSearch(!isSearch)}
                  >
                    <abbr title="Поиск сообщений">
                      <SearchIcon />
                    </abbr>
                  </OptionButton>
                  <OptionButton>
                    <abbr title="Настройки">
                      <EllipsisVerticalIcon />
                    </abbr>
                  </OptionButton>
                  <OptionButton
                    className="close-button"
                    onClick={handleCloseButton}
                  >
                    <abbr title="Закрыть чат">
                      <XmarkIcon />
                    </abbr>
                  </OptionButton>
                </motion.div>
              </motion.header>
            </DrawOutline>
            <motion.main className="chat__body">
              <Messages
                user={user as UserInfo}
                chat_id={chat_id as string}
                isSearch={isSearch}
                selectedMessageId={selectedMessageId}
              />
            </motion.main>
            <motion.footer
              layoutId="chat__footer"
              className="chat__footer"
              variants={chatFooterVariants}
              initial="full"
              animate={isSearch ? 'reduced' : 'full'}
              transition={{ duration: 0.3 }}
            >
              <MessageForm
                sendMessage={sendMessage}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                onFocus={handleFocus}
              />
            </motion.footer>
          </motion.div>
        )}
        <AnimatePresence>
          {isSearch && (
            <motion.div
              className="search-messages"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={searchVariants}
              transition={{ duration: 0.3 }}
            >
              <SearchMessages
                chatId={chat_id as string}
                onMessageSelect={handleMessageSelect}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {loading && <Loader />}
      </motion.div>
    </AnimatePresence>
  );
};

export default Chat;
