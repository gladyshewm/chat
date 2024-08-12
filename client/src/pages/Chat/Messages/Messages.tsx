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
              const isLast =
                index === messagesArray.length - 1 ||
                messagesArray[index + 1].userId !== message.userId;

              return (
                <div
                  key={message.id}
                  className={
                    message.userId === user.uuid
                      ? 'message_me-block'
                      : `message-block ${isLast ? 'last' : ''}`
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
                    <p className="message-text">{message.content}</p>
                    <p className="message-time">
                      {String(format(new Date(message.createdAt), 'HH:mm'))}
                    </p>
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
