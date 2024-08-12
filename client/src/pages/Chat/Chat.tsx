import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Chat.css';
import useAuth from '../../hooks/useAuth';
import { useChatByIdLazyQuery, useSendMessageMutation } from './chat.generated';
import { ChatWithoutMessages, UserInfo } from '../../types.generated';
import Messages from './Messages/Messages';
import MessageForm from './MessageForm/MessageForm';
import CustomLoader from '../../components/CustomLoader/CustomLoader';
import DrawOutlineRect from '../../components/DrawOutline/DrawOutlineRect/DrawOutlineRect';
import DrawOutline from '../../components/DrawOutline/DrawOutline/DrawOutline';
import UserGroupIcon from '../../icons/UserGroupIcon';
import SpaceBackground from '../Main/SpaceBackground/SpaceBackground';

const Chat = () => {
  const { user } = useAuth();
  const { id: chat_id } = useParams<{ id: string }>();
  const [chat, setChat] = useState<ChatWithoutMessages | null>(null);
  const [postMessage] = useSendMessageMutation();
  const [chatQuery, { data, loading, error }] = useChatByIdLazyQuery();

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

  const getParticipants = (count: number) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return `${count} участников`;
    } else if (lastDigit === 1) {
      return `${count} участник`;
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      return `${count} участника`;
    } else {
      return `${count} участников`;
    }
  };

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
                        <span className="chat__count">
                          {getParticipants(chat.participants.length)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="buttons">
                  <button>ss</button>
                  <button>ss</button>
                  <button>ss</button>
                </div>
              </div>
            </DrawOutline>
            <Messages user={user as UserInfo} chat_id={chat_id as string} />
            <div className="chat-separator__wrapper">
              <hr className="chat-separator" />
            </div>
            <MessageForm sendMessage={sendMessage} />
          </>
        )}
      </div>
      {loading && <CustomLoader />}
    </motion.div>
  );
};

export default Chat;
