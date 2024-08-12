import { FC, useEffect, useState } from 'react';
import { format } from 'date-fns';
import './Messages.css';
import { Message, UserInfo } from '../../../types.generated';
import {
  useChatMessagesQuery,
  useMessageSentSubscription,
} from '../chat.generated';
import { groupMessagesByDate } from '../../../utils/messages';

interface MessagesProps {
  user: UserInfo;
  chat_id: string;
}

const Messages: FC<MessagesProps> = ({ user, chat_id }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useMessageSentSubscription({
    variables: {
      chatId: chat_id,
    },
    onError: (error) => {
      console.error(error);
    },
    onData: (data) => {
      if (!data) return;

      setMessages((prevMessages) => {
        const newMessage = data.data.data?.messageSent;
        if (!newMessage) return prevMessages;
        if (!prevMessages.some((msg) => msg.id === newMessage.id)) {
          return [newMessage, ...prevMessages];
        }
        return prevMessages;
      });
    },
  });

  useChatMessagesQuery({
    variables: {
      chatId: chat_id,
      offset: 0,
      limit: 100,
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

  const scrollToBottom = () => {
    const messagesContainer = document.querySelector('.message-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="message-container">
      {Object.keys(groupedMessages).map((date) => (
        <div className="wrapper" key={date}>
          <div className="date-divider">
            <span>{date}</span>
          </div>
          <div className="messages-group">
            {groupedMessages[date].map((message, index, messagesArray) => {
              const isFirst =
                index === 0 ||
                messagesArray[index - 1].userId !== message.userId;
              const isLast =
                index === messagesArray.length - 1 ||
                messagesArray[index + 1].userId !== message.userId;

              return (
                <div
                  key={message.id}
                  className={
                    message.userId === user.uuid
                      ? 'message_me-block'
                      : `message-block ${isLast ? 'last' : isFirst ? 'first' : ''}`
                  }
                >
                  {message.userId !== user.uuid && isLast && (
                    <div className="message-avatar">
                      {message.avatarUrl ? (
                        <img src={message.avatarUrl} alt="avatar" />
                      ) : (
                        <p>{message.userName.slice(0, 1).toUpperCase()}</p>
                      )}
                    </div>
                  )}
                  <div
                    className={
                      message.userId === user.uuid ? 'message_me' : 'message'
                    }
                  >
                    {message.userId !== user.uuid && isFirst && (
                      <p className="message-username">{message.userName}</p>
                    )}
                    <div className="message-main">
                      <p className="message-text">{message.content}</p>
                      <p className="message-time">
                        {String(format(new Date(message.createdAt), 'HH:mm'))}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
