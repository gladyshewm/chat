import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
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

const Chat = () => {
  const { user } = useAuth();
  const { id: chat_id } = useParams<{ id: string }>();
  const [chat, setChat] = useState<ChatWithoutMessages | null>(null);
  const [postMessage] = useSendMessageMutation();
  const [chatQuery, { data, loading, error }] = useChatByIdLazyQuery();
  const [sendTypingStatus] = useSendTypingStatusMutation();
  const [typingStatus, setTypingStatus] = useState<TypingFeedback | null>(null);
  const [isSearch, setIsSearch] = useState(false);

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

  if (error) return <div>{`Ошибка: ${error.message}`}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="chat"
    >
      <SpaceBackground />
      <div className="chat-content">
        {!chat ? (
          <CustomLoader />
        ) : (
          <>
            <DrawOutline orientation="horizontal" position="bottom">
              <div className="chat__header">
                <div className="main">
                  {chat.isGroupChat ? (
                    <>
                      <DrawOutlineRect className="avatar-wrapper" rx="50%">
                        <div className="chat__avatar">
                          {chat.groupAvatarUrl ? (
                            <img
                              src={`${chat.groupAvatarUrl}`}
                              alt="chat-avatar"
                            />
                          ) : (
                            <UserGroupIcon />
                          )}
                        </div>
                      </DrawOutlineRect>
                      <div className="chat__info">
                        <span className="chat__name">{chat.name}</span>
                        <div className="chat__count">
                          {getParticipants(chat.participants.length)}
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                {typingStatus?.isTyping &&
                  typingStatus.userName !== user?.name && (
                    <div className="feedback">
                      <span>{typingStatus.userName}...</span>
                      <PencilIcon />
                    </div>
                  )}
                <div className="buttons">
                  <OptionButton
                    className="search"
                    onClick={() => setIsSearch(!isSearch)}
                  >
                    <SearchIcon />
                  </OptionButton>
                  <OptionButton>
                    <EllipsisVerticalIcon />
                  </OptionButton>
                </div>
              </div>
            </DrawOutline>
            <Messages user={user as UserInfo} chat_id={chat_id as string} />
            <div className="chat-separator__wrapper">
              <hr className="chat-separator" />
            </div>
            <MessageForm
              sendMessage={sendMessage}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onFocus={handleFocus}
            />
          </>
        )}
      </div>
      <SearchMessages isSearch={isSearch} setIsSearch={setIsSearch} />
      {loading && <CustomLoader />}
    </motion.div>
  );
};

export default Chat;
