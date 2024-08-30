import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './Chat.css';
import {
  useChatByIdLazyQuery,
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
import { ChatSidebar } from '@widgets';

const Chat = () => {
  const { user } = useAuth();
  const { id: chat_id } = useParams<{ id: string }>();
  const [chatQuery, { loading, error }] = useChatByIdLazyQuery();
  const [sendTypingStatus] = useSendTypingStatusMutation();
  const [chat, setChat] = useState<ChatWithoutMessages | null>(null);
  const [isSearch, setIsSearch] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );
  const [isChatInfo, setIsChatInfo] = useState(false);

  useEffect(() => {
    setChat(null);
    chatQuery({
      variables: {
        chatId: chat_id as string,
      },
      onCompleted: (data) => {
        if (data && data.chatById) {
          setChat(data.chatById as ChatWithoutMessages);
        }
      },
    });
  }, [chatQuery, chat_id]);

  const updateChat = (updatedChat: ChatWithoutMessages) => {
    setChat(updatedChat);
  };

  /* const handleOptimisticUpdate = (optimisticMessage: Message) => {
    setMessages((prevMessages) => [optimisticMessage, ...prevMessages]);
  }; */

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
    <AnimatePresence mode="wait">
      <motion.div className="chat" key={chat_id} {...chatVariants}>
        <SpaceBackground />
        {!chat || loading ? (
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
                chat_id={chat_id as string}
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
          updateChat={updateChat}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Chat;
