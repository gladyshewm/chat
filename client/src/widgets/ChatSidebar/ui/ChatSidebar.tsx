import './ChatSidebar.css';
import { AnimatePresence, motion } from 'framer-motion';
import { searchVariants } from './motion';
import { SearchMessages } from './SearchMessages';
import { ChatProfile } from './ChatProfile';

interface ChatSidebarProps {
  isSearchMessages: boolean;
  setIsSearchMessages: (isSearch: boolean) => void;
  handleMessageSelect: (messageId: string) => void;
  isChatInfo: boolean;
  setIsChatInfo: (isChatInfo: boolean) => void;
}

const ChatSidebar = ({
  isSearchMessages,
  setIsSearchMessages,
  handleMessageSelect,
  isChatInfo,
  setIsChatInfo,
}: ChatSidebarProps) => {
  return (
    <AnimatePresence mode="wait">
      {(isSearchMessages || isChatInfo) && (
        <motion.div
          className="search-messages"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={searchVariants}
          transition={{ duration: 0.3 }}
        >
          {isSearchMessages ? (
            <SearchMessages
              onMessageSelect={handleMessageSelect}
              setIsSearch={setIsSearchMessages}
            />
          ) : (
            <ChatProfile setIsChatInfo={setIsChatInfo} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatSidebar;
