import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './Chat.css';
import {
  useChatByIdLazyQuery,
  useSendMessageMutation,
  useSendTypingStatusMutation,
} from './chat.generated';
import { ChatWithoutMessages, UserInfo } from '@shared/types';
import { DrawOutline, Loader, SpaceBackground } from '@shared/ui';
import { useAuth } from '@app/providers/hooks/useAuth';
import { MessageForm, Messages } from '@features';
import {
  chatContentVariants,
  chatFooterVariants,
  chatVariants,
} from './motion';
import ChatHeader from './ChatHeader/ChatHeader';
import { FullScreenProvider } from '@app/providers';
import { FullScreenSlider } from '@shared/ui/Slider';
import { ChatSidebar } from '@widgets';

const Chat = () => {
  const { user } = useAuth();
  const { id: chat_id } = useParams<{ id: string }>();
  const [postMessage] = useSendMessageMutation();
  const [chatQuery, { data, loading, error }] = useChatByIdLazyQuery();
  const [sendTypingStatus] = useSendTypingStatusMutation();
  const [chat, setChat] = useState<ChatWithoutMessages | null>(null);
  const [isSearch, setIsSearch] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );
  const [isChatInfo, setIsChatInfo] = useState(false);

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

  const handleSearchToggle = (value: boolean) => {
    setIsSearch(value);
    if (value) {
      setIsChatInfo(false);
    }
  };

  const handleChatInfoToggle = (value: boolean) => {
    setIsChatInfo(value);
    if (value) {
      setIsSearch(false);
    }
  };

  const handleMessageSelect = (messageId: string) => {
    setSelectedMessageId(messageId);
  };

  if (error) return <div>{`Ошибка: ${error.message}`}</div>;

  return (
    <FullScreenProvider>
      <FullScreenSlider />
      <AnimatePresence mode="wait">
        <motion.div className="chat" key={chat_id} {...chatVariants}>
          <SpaceBackground />
          {!chat ? (
            <Loader />
          ) : (
            <motion.div
              key={chat.id}
              className={`chat-content ${isSearch || isChatInfo ? 'reduced' : ''}`}
              variants={chatContentVariants}
              initial="fullWidth"
              animate={isSearch || isChatInfo ? 'reduced' : 'full'}
              transition={{ duration: 0.3 }}
            >
              <DrawOutline orientation="horizontal" position="bottom">
                <ChatHeader
                  chat={chat}
                  user={user}
                  setIsSearch={handleSearchToggle}
                  setIsChatInfo={handleChatInfoToggle}
                />
              </DrawOutline>
              <motion.main className="chat__body">
                <Messages
                  user={user as UserInfo}
                  chat={chat}
                  isSearch={isSearch}
                  isChatInfo={isChatInfo}
                  selectedMessageId={selectedMessageId}
                />
              </motion.main>
              <motion.footer
                layoutId="chat__footer"
                className="chat__footer"
                variants={chatFooterVariants}
                initial="full"
                animate={isSearch || isChatInfo ? 'reduced' : 'full'}
                transition={{ duration: 0.3 }}
              >
                <MessageForm
                  sendMessage={sendMessage}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                />
              </motion.footer>
            </motion.div>
          )}
          <ChatSidebar
            chat={chat as ChatWithoutMessages}
            isSearch={isSearch}
            setIsSearch={handleSearchToggle}
            handleMessageSelect={handleMessageSelect}
            isChatInfo={isChatInfo}
            setIsChatInfo={handleChatInfoToggle}
          />
          {loading && <Loader />}
        </motion.div>
      </AnimatePresence>
    </FullScreenProvider>
  );
};

export default Chat;
