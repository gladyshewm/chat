import { useEffect, useRef, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { format } from 'date-fns';
import './Messages.css';
import {
  AvatarInfo,
  ChatWithoutMessages,
  Message,
  UserInfo,
} from '@shared/types';
import { ImageLoader, Loader, ScrollButton } from '@shared/ui';
import {
  useChatMessagesQuery,
  useMessageSentSubscription,
} from './messages.generated';
import { groupMessagesByDate } from '../utils';
import { containerVariants, wrapperVariants } from './motion';
import { UserIcon } from '@shared/assets';
import { FullScreenSlider, useFullScreenSlider } from '@shared/ui/Slider';

interface MessagesProps {
  chat: ChatWithoutMessages;
  user: UserInfo;
  isSearch: boolean;
  selectedMessageId: string | null;
  isChatInfo: boolean;
}

const Messages = ({
  chat,
  user,
  isSearch,
  selectedMessageId,
  isChatInfo,
}: MessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });
  const isLoadingRef = useRef(false);
  const MESSAGES_PER_PAGE = 50;
  const {
    openSlider,
    isOpen,
    currentImage,
    images,
    headerContent,
    closeSlider,
    navigateSlider,
  } = useFullScreenSlider();

  const { loading, error, fetchMore } = useChatMessagesQuery({
    variables: {
      chatId: chat?.id as string,
      offset: 0,
      limit: MESSAGES_PER_PAGE,
    },
    onCompleted: (data) => {
      if (data && data.chatMessages) {
        setMessages(data.chatMessages as Message[]);
      }
    },
    onError: (error) => {
      console.error(error);
    },
    fetchPolicy: 'cache-and-network',
  });

  useMessageSentSubscription({
    variables: {
      chatId: chat?.id as string,
    },
    onError: (error) => {
      console.error(error);
    },
    onData: (data) => {
      if (!data || !data.data.data?.messageSent) return;
      const newMessage = data.data.data.messageSent;

      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg.id === newMessage.id)) {
          return prevMessages;
        }

        return [newMessage, ...prevMessages];
      });
    },
  });

  useEffect(() => {
    const fetchMoreMessages = async () => {
      if (isLoadingRef.current || !hasMore) return;
      isLoadingRef.current = true;
      const newOffset = offset + MESSAGES_PER_PAGE;

      try {
        const { data } = await fetchMore({
          variables: {
            chatId: chat?.id,
            offset: newOffset,
            limit: MESSAGES_PER_PAGE,
          },
        });

        if (data && data.chatMessages) {
          if (data.chatMessages.length < MESSAGES_PER_PAGE) {
            setHasMore(false);
          }

          setMessages((prevMessages) => {
            const newMessages = data.chatMessages as Message[];
            const uniqueNewMessages = newMessages.filter(
              (newMsg) =>
                !prevMessages.some((prevMsg) => prevMsg.id === newMsg.id),
            );
            return [...uniqueNewMessages, ...prevMessages];
          });

          setOffset(newOffset);
        }
      } catch (error) {
        console.error(`Error fetching more messages: ${error}`);
      } finally {
        isLoadingRef.current = false;
      }
    };

    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

        if (
          scrollHeight + scrollTop <= clientHeight + 100 &&
          !loading &&
          !isLoadingRef.current &&
          hasMore
        ) {
          fetchMoreMessages();
        }
      }
    };

    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [offset, loading, fetchMore, chat?.id, hasMore]);

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
    if (messages.length > 0 && offset === 0) scrollToBottom();
  }, [messages, offset]);

  useEffect(() => {
    scrollYProgress.on('change', (progress) => {
      const isAtBottom = progress === 0;
      setIsScrolled(!isAtBottom);
    });
  }, [scrollYProgress]);

  const handleImageClick = (message: Message) => {
    const headerContent = (
      <div className="profile-info__header">
        <div className="header__info">
          {message && (
            <>
              <div className="header__avatar">
                {message.avatarUrl ? (
                  <img src={message.avatarUrl} alt="avatar" />
                ) : (
                  <UserIcon />
                )}
              </div>
              <div className="header__name">
                <span>{message.userName}</span>
              </div>
            </>
          )}
        </div>
      </div>
    );

    const image: AvatarInfo = {
      url: message.attachedFiles[0]?.fileUrl as string,
      createdAt: message.createdAt,
      name: '',
    };

    openSlider([image], image, headerContent);
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <>
      {loading && offset === 0 && <Loader />}
      {error && <div>Ошибка: {error.message}</div>}
      <FullScreenSlider
        isOpen={isOpen}
        currentImage={currentImage}
        images={images}
        headerContent={headerContent}
        onClose={closeSlider}
        onNavigate={navigateSlider}
      />
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
            <motion.div
              className="wrapper"
              key={date}
              variants={wrapperVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
            >
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
                              <p>
                                {message.userName.slice(0, 1).toUpperCase()}
                              </p>
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
                          isFirst &&
                          !message.hasFiles && (
                            <p className="message-username">
                              {message.userName}
                            </p>
                          )}
                        <motion.div className="message-main">
                          {message.hasFiles && (
                            <div id="attached-files">
                              {message.attachedFiles.map((file) => (
                                <ImageLoader
                                  key={file?.fileId}
                                  src={file?.fileUrl as string}
                                  alt="attached file"
                                  className="attached-file"
                                  onClick={() => handleImageClick(message)}
                                  aspectRatio={1}
                                />
                              ))}
                              {!message.content && (
                                <time className="message-time overlay-time">
                                  {String(
                                    format(
                                      new Date(message.createdAt),
                                      'HH:mm',
                                    ),
                                  )}
                                </time>
                              )}
                            </div>
                          )}
                          {message.content && (
                            <div id="main-content">
                              <p className="message-text">{message.content}</p>
                              <time className="message-time">
                                {String(
                                  format(new Date(message.createdAt), 'HH:mm'),
                                )}
                              </time>
                            </div>
                          )}
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
    </>
  );
};

export default Messages;
