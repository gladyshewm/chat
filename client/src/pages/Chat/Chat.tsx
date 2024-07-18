import React, { FC, useEffect, useState } from 'react';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { motion } from 'framer-motion';
import { MESSAGES_SUBSCRIPTION } from '../../graphql/subscriptions/messages';
import './Chat.css';
import SendIcon from '../../icons/SendIcon';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { GET_CHAT_MESSAGES } from '../../graphql/query/chats';
import { SEND_MESSAGE } from '../../graphql/mutations/messages';

interface User {
  uuid: string;
  name: string;
  email: string;
}

interface MessagesProps {
  user: User;
  chat_id: string;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}

const Messages: FC<MessagesProps> = ({ user, chat_id }) => {
  const { data: messagesContent, loading: loadingMessages } = useSubscription(
    MESSAGES_SUBSCRIPTION,
    {
      variables: {
        chatId: chat_id,
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );

  const [messages, setMessages] = useState<Message[]>([]);

  useQuery(GET_CHAT_MESSAGES, {
    variables: {
      chatId: chat_id,
    },
    onCompleted: (data) => {
      if (data) {
        setMessages(data.chatMessages);
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

  const [postMessage] = useMutation(SEND_MESSAGE);

  const sendMessage = (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (message) {
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
      <Messages user={user as User} chat_id={chat_id as string} />
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
