import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Chat.css';
import useAuth from '../../hooks/useAuth';
import {
  useChatMessagesQuery,
  useMessageSentSubscription,
  useSendMessageMutation,
} from './chat.generated';
import { Message, UserInfo } from '../../types.generated';
import SendIcon from '../../icons/SendIcon';

interface MessagesProps {
  user: UserInfo;
  chat_id: string;
}

const Messages: FC<MessagesProps> = ({ user, chat_id }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: messagesContent } = useMessageSentSubscription({
    variables: {
      chatId: chat_id,
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useChatMessagesQuery({
    variables: {
      chatId: chat_id,
    },
    onCompleted: (data) => {
      if (data) {
        setMessages(data.chatMessages as Message[]);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (messagesContent) {
      setMessages((prevMessages) => {
        const newMessage = messagesContent.messageSent;
        if (!prevMessages.some((msg) => msg.id === newMessage.id)) {
          return [newMessage, ...prevMessages];
        }
        return prevMessages;
      });
    }
  }, [messagesContent]);

  return (
    <div className="message-container">
      {messages.map((message) => (
        <div
          key={message.id}
          className={
            message.userId === user.uuid ? 'message_me-block' : 'message-block'
          }
        >
          {message.userId !== user.uuid && (
            <div className="message-avatar">
              {message.avatarUrl ? (
                <img src={message.avatarUrl} alt="avatar" />
              ) : (
                <p>{message.userName.slice(0, 1).toUpperCase()}</p>
              )}
            </div>
          )}
          <div
            className={message.userId === user.uuid ? 'message_me' : 'message'}
          >
            <p>{message.content}</p>
            <p>{message.createdAt.toString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Chat = () => {
  const { user } = useAuth();
  const { id: chat_id } = useParams<{ id: string }>();
  const [message, setMessage] = useState('');

  const [postMessage] = useSendMessageMutation();

  const sendMessage = (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (chat_id && message) {
      postMessage({
        variables: {
          chatId: chat_id,
          content: message,
        },
      });
      setMessage('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="chat"
    >
      <div className="chat__header">Чат</div>
      <Messages user={user as UserInfo} chat_id={chat_id as string} />
      <form className="message-form" id="message-form">
        <input
          type="text"
          name="message"
          id="message-input"
          className="message-input"
          value={message}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) =>
            e.key === 'Enter' && sendMessage(e as any)
          }
        />
        <div className="v-divider"></div>
        <button onClick={sendMessage} type="submit" className="send-button">
          Отправить
          <SendIcon />
        </button>
      </form>
    </motion.div>
  );
};

export default Chat;
