import './ChatSidebar.css';
import { AnimatePresence, motion } from 'framer-motion';
import { searchVariants } from './motion';
import { ChatWithoutMessages } from '@shared/types';
import { SearchMessages } from './SearchMessages';
import { ChatProfile } from './ChatProfile';

interface ChatSidebarProps {
  chat: ChatWithoutMessages;
  isSearch: boolean;
  setIsSearch: (isSearch: boolean) => void;
  handleMessageSelect: (messageId: string) => void;
  isChatInfo: boolean;
  setIsChatInfo: (isChatInfo: boolean) => void;
}

const ChatSidebar = ({
  isSearch,
  setIsSearch,
  handleMessageSelect,
  chat,
  isChatInfo,
  setIsChatInfo,
}: ChatSidebarProps) => {
  return (
    <AnimatePresence>
      {(isSearch || isChatInfo) && (
        <motion.div
          className="search-messages"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={searchVariants}
          transition={{ duration: 0.3 }}
        >
          {isSearch ? (
            <SearchMessages
              chatId={chat.id}
              onMessageSelect={handleMessageSelect}
              setIsSearch={setIsSearch}
            />
          ) : (
            <ChatProfile setIsChatInfo={setIsChatInfo} chat={chat} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatSidebar;
