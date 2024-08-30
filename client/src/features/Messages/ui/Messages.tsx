import { useEffect, useRef, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { format } from 'date-fns';
import './Messages.css';
import { ChatWithoutMessages, Message, UserInfo } from '@shared/types';
import { ScrollButton } from '@shared/ui';
import {
  useChatMessagesQuery,
  useMessageSentSubscription,
} from './messages.generated';
import { groupMessagesByDate } from '../utils';
import { containerVariants } from './motion';

interface MessagesProps {
  user: UserInfo;
  chat: ChatWithoutMessages;
  isSearch: boolean;
  selectedMessageId: string | null;
  isChatInfo: boolean;
}

const Messages = ({
  user,
  chat,
  isSearch,
  selectedMessageId,
  isChatInfo,
}: MessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  useChatMessagesQuery({
    variables: {
      chatId: chat.id,
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

  useMessageSentSubscription({
    variables: {
      chatId: chat.id,
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

  useEffect(() => {
    if (selectedMessageId) {
      const selectedMessageElement = document.getElementById(
        `message-${selectedMessageId}`,
      );

      if (!selectedMessageElement) return;

      selectedMessageElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      selectedMessageElement.classList.add('highlighted');

      setTimeout(() => {
        selectedMessageElement.classList.remove('highlighted');
      }, 2000);
    }
  }, [selectedMessageId]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollYProgress.on('change', (progress) => {
      const isAtBottom = progress === 0;
      setIsScrolled(!isAtBottom);
    });
  }, [scrollYProgress]);

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <motion.div
      className="message-container"
      ref={containerRef}
      initial="full"
      animate={isSearch || isChatInfo ? 'reduced' : 'full'}
      variants={containerVariants}
    >
      {Object.keys(groupedMessages)
        .reverse()
        .map((date) => (
          <motion.div className="wrapper" key={date}>
            <motion.div className="date-divider">
              <time>{date}</time>
            </motion.div>
            <motion.div className="messages-group">
              {groupedMessages[date].map((message, index, messagesArray) => {
                const isFirst =
                  index === 0 ||
                  messagesArray[index - 1].userId !== message.userId;
                const isLast =
                  index === messagesArray.length - 1 ||
                  messagesArray[index + 1].userId !== message.userId;

                return (
                  <motion.div
                    key={message.id}
                    id={`message-${message.id}`}
                    className={
                      message.userId === user.uuid
                        ? 'message_me-block'
                        : `message-block ${isLast ? 'last' : isFirst ? 'first' : ''}`
                    }
                  >
                    {chat.isGroupChat &&
                      message.userId !== user.uuid &&
                      isLast && (
                        <motion.div className="message-avatar">
                          {message.avatarUrl ? (
                            <img src={message.avatarUrl} alt="avatar" />
                          ) : (
                            <p>{message.userName.slice(0, 1).toUpperCase()}</p>
                          )}
                        </motion.div>
                      )}
                    <motion.div
                      className={
                        message.userId === user.uuid
                          ? `message_me ${isLast ? 'last' : isFirst ? 'first' : ''}`
                          : `message ${isLast ? 'last' : isFirst ? 'first' : ''}`
                      }
                    >
                      {chat.isGroupChat &&
                        message.userId !== user.uuid &&
                        isFirst && (
                          <p className="message-username">{message.userName}</p>
                        )}
                      <motion.div className="message-main">
                        <p className="message-text">{message.content}</p>
                        <time className="message-time">
                          {String(format(new Date(message.createdAt), 'HH:mm'))}
                        </time>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        ))}
      <ScrollButton isScrolled={isScrolled} scrollToBottom={scrollToBottom} />
    </motion.div>
  );
};

export default Messages;
