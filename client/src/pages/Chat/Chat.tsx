import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './Chat.css';
import useAuth from '../../hooks/useAuth';
import {
  useChatByIdLazyQuery,
  useSendMessageMutation,
  useSendTypingStatusMutation,
  useUserTypingSubscription,
} from './chat.generated';
import {
  ChatWithoutMessages,
  TypingFeedback,
  UserInfo,
} from '../../types.generated';
import { getParticipants } from '../../utils/chat';
import Messages from './Messages/Messages';
import OptionButton from '../../components/buttons/OptionButton/OptionButton';
import CustomLoader from '../../components/CustomLoader/CustomLoader';
import SpaceBackground from '../Main/SpaceBackground/SpaceBackground';
import DrawOutlineRect from '../../components/DrawOutline/DrawOutlineRect/DrawOutlineRect';
import DrawOutline from '../../components/DrawOutline/DrawOutline/DrawOutline';
import UserGroupIcon from '../../icons/UserGroupIcon';
import PencilIcon from '../../icons/PencilIcon';
import SearchIcon from '../../icons/SearchIcon';
import EllipsisVerticalIcon from '../../icons/EllipsisVerticalIcon';
import SearchMessages from './SearchMessages/SearchMessages';
import MessageForm from '../../components/forms/MessageForm/MessageForm';
import XmarkIcon from '../../icons/XmarkIcon';

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

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="chat"
    >
      <SpaceBackground />
      <AnimatePresence mode="wait">
        <motion.div layout className="chat-content">
          {!chat ? (
            <CustomLoader />
          ) : (
            <>
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
                            {getParticipants(chat.participants.length)}
                          </motion.div>
                        </motion.div>
                      </>
                    ) : (
                      <></>
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
                      <SearchIcon />
                    </OptionButton>
                    <OptionButton>
                      <EllipsisVerticalIcon />
                    </OptionButton>
                    <OptionButton
                      className="close-button"
                      onClick={handleCloseButton}
                    >
                      <XmarkIcon />
                    </OptionButton>
                  </motion.div>
                </motion.div>
              </DrawOutline>
              <Messages user={user as UserInfo} chat_id={chat_id as string} />
              <motion.div className="chat-separator__wrapper">
                <hr className="chat-separator" />
              </motion.div>
              <MessageForm
                sendMessage={sendMessage}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                onFocus={handleFocus}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>
      <SearchMessages isSearch={isSearch} setIsSearch={setIsSearch} />
      {loading && <CustomLoader />}
    </motion.div>
  );
};

export default Chat;
