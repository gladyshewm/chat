import React, { FC, useEffect, useState } from 'react';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { GET_MESSAGES } from '../../graphql/query/messages';
import { POST_MESSAGE } from '../../graphql/mutations/messages';
import { MESSAGES_SUBSCRIPTION } from '../../graphql/subscriptions/messages';
import './Chat.css';
import SendIcon from '../icons/SendIcon';
import CustomLoader from '../CustomLoader/CustomLoader';

interface MessagesProps {
  user: string;
}

interface MessagesContent {
  id: string;
  user: string;
  content: string;
}

const Messages: FC<MessagesProps> = ({ user }) => {
  /* const { data, loading, error, refetch } = useQuery(GET_ALL_USERS, { pollInterval: 1000 }); */
  /* const { data: messagesContent, loading: loadingMessages } = useQuery(GET_MESSAGES); */
  const { data: messagesContent, loading: loadingMessages } = useSubscription(
    MESSAGES_SUBSCRIPTION,
  );
  const [messages, setMessages] = useState<MessagesContent[]>([]);

  useEffect(() => {
    if (messagesContent) {
      setMessages((prevMessages) => [
        ...prevMessages,
        messagesContent.messageAdded,
      ]);
    }
  }, [messagesContent]);

  if (loadingMessages) {
    return <CustomLoader />;
  }

  return (
    <div className="message-container">
      {messages.map((message) => (
        <div
          key={message.id}
          className={
            message.user === user ? 'message_me-block' : 'message-block'
          }
        >
          {message.user !== user && (
            <div className="avatar">
              <p>{message.user.slice(0, 1).toUpperCase()}</p>
            </div>
          )}
          <div className={message.user === user ? 'message_me' : 'message'}>
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
};

const Chat = () => {
  const [user, setUser] = useState<string>('Blya1');
  const [message, setMessage] = useState('');
  const [postMessage] = useMutation(POST_MESSAGE);

  const sendMessage = (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (message) {
      postMessage({
        variables: {
          user,
          content: message,
        },
      });
      setMessage('');
    }
  };

  return (
    <div className="chat">
      <Messages user={user} />
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
    </div>
  );
};

export default Chat;
