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
import {
  chatContentVariants,
  chatFooterVariants,
  chatVariants,
} from './motion';
import ChatHeader from './ChatHeader/ChatHeader';
import { ChatSidebar, MessageForm, Messages } from '@widgets';
import { ChatProvider, useChat } from '../ctx/ChatContext';

const Chat = () => {
  const { user } = useAuth();
  const { id: chat_id } = useParams<{ id: string }>();
  const [isSearchMessages, setIsSearchMessages] = useState(false);
  const [isChatInfo, setIsChatInfo] = useState(false);
  const [chat, setChat] = useState<ChatWithoutMessages | null>(null);
  const [chatQuery, { loading, error }] = useChatByIdLazyQuery();

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

  useEffect(() => {
    setIsSearchMessages(false);
    setIsChatInfo(false);
  }, [chat_id]);

  if (error) return <div>{`Ошибка: ${error.message}`}</div>;

  if (loading || !chat) {
    return <Loader />;
  }

  return (
    <ChatProvider chat={chat} setChat={setChat}>
      <ChatContent
        user={user}
        isSearchMessages={isSearchMessages}
        setIsSearchMessages={setIsSearchMessages}
        isChatInfo={isChatInfo}
        setIsChatInfo={setIsChatInfo}
      />
    </ChatProvider>
  );
};

interface ChatContentProps {
  user: UserInfo | null;
  isSearchMessages: boolean;
  setIsSearchMessages: (value: boolean) => void;
  isChatInfo: boolean;
  setIsChatInfo: (value: boolean) => void;
}

const ChatContent = ({
  user,
  isSearchMessages,
  setIsSearchMessages,
  isChatInfo,
  setIsChatInfo,
}: ChatContentProps) => {
  const [sendTypingStatus] = useSendTypingStatusMutation();
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );
  const { chat } = useChat();

  const handleKeyDown = () => {
    sendTypingStatus({
      variables: {
        chatId: chat?.id as string,
        userName: user?.name as string,
        isTyping: true,
      },
    });
  };

  const handleBlur = () => {
    sendTypingStatus({
      variables: {
        chatId: chat?.id as string,
        userName: user?.name as string,
        isTyping: false,
      },
    });
  };

  const handleFocus = () => {
    sendTypingStatus({
      variables: {
        chatId: chat?.id as string,
        userName: user?.name as string,
        isTyping: true,
      },
    });
  };

  const handleSearchToggle = (value: boolean) => {
    setIsSearchMessages(value);
    if (value) {
      setIsChatInfo(false);
    }
  };

  const handleChatInfoToggle = (value: boolean) => {
    setIsChatInfo(value);
    if (value) {
      setIsSearchMessages(false);
    }
  };

  const handleMessageSelect = (messageId: string) => {
    setSelectedMessageId(messageId);
  };

  if (!chat) {
    return <Loader />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="chat"
        key={chat.id}
        {...chatVariants}
        transition={{ duration: 0.3 }}
      >
        <SpaceBackground />
        <motion.div
          key={chat.id}
          className={`chat-content ${isSearchMessages || isChatInfo ? 'reduced' : ''}`}
          variants={chatContentVariants}
          initial="fullWidth"
          animate={isSearchMessages || isChatInfo ? 'reduced' : 'full'}
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
              chat={chat}
              user={user as UserInfo}
              isSearch={isSearchMessages}
              isChatInfo={isChatInfo}
              selectedMessageId={selectedMessageId}
            />
          </motion.main>
          <motion.footer
            layoutId="chat__footer"
            className="chat__footer"
            variants={chatFooterVariants}
            initial="full"
            animate={isSearchMessages || isChatInfo ? 'reduced' : 'full'}
            transition={{ duration: 0.3 }}
          >
            <MessageForm
              chat_id={chat.id as string}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onFocus={handleFocus}
            />
          </motion.footer>
        </motion.div>
        <ChatSidebar
          isSearchMessages={isSearchMessages}
          setIsSearchMessages={handleSearchToggle}
          handleMessageSelect={handleMessageSelect}
          isChatInfo={isChatInfo}
          setIsChatInfo={handleChatInfoToggle}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Chat;
