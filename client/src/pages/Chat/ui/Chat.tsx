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
  EllipsisVerticalIcon,
  Loader,
  OptionButton,
  PencilIcon,
  SearchIcon,
  SpaceBackground,
  UserGroupIcon,
  XmarkIcon,
} from '@shared/ui';
import { useAuth } from '@app/providers/hooks/useAuth';
import { MessageForm, Messages, SearchMessages } from '@features';
import { formatParticipants } from '../utils';

const Chat = () => {
  const { user } = useAuth();
  const { id: chat_id } = useParams<{ id: string }>();
  const [chat, setChat] = useState<ChatWithoutMessages | null>(null);
  const [postMessage] = useSendMessageMutation();
  const [chatQuery, { data, loading, error }] = useChatByIdLazyQuery();
  const [sendTypingStatus] = useSendTypingStatusMutation();
  const [typingStatus, setTypingStatus] = useState<TypingFeedback | null>(null);
  const [isSearch, setIsSearch] = useState(false);
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

  if (error) return <div>{`Ошибка: ${error.message}`}</div>;

  const chatVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const chatContentVariants = {
    fullWidth: { width: '100%' },
    partialWidth: { width: 'calc(100% - 28rem)' },
  };

  return (
    <motion.div className="chat" {...chatVariants}>
      <SpaceBackground />
      <AnimatePresence initial={false}>
        {!chat ? (
          <Loader />
        ) : (
          <motion.div
            key={chat.id}
            className={`chat-content ${isSearch ? 'reduced' : ''}`}
            variants={chatContentVariants}
            initial="fullWidth"
            animate={isSearch ? 'partialWidth' : 'fullWidth'}
          >
            <DrawOutline orientation="horizontal" position="bottom">
              <motion.div className="chat__header">
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
              </motion.div>
            </DrawOutline>
            <motion.div className="chat__body">
              <Messages user={user as UserInfo} chat_id={chat_id as string} />
            </motion.div>
            <motion.div className="chat__footer">
              <MessageForm
                sendMessage={sendMessage}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                onFocus={handleFocus}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {isSearch && <SearchMessages chatId={chat_id as string} />}
      {loading && <Loader />}
    </motion.div>
  );
};

export default Chat;
