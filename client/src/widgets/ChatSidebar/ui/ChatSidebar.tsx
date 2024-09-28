import './ChatSidebar.css';
import { AnimatePresence, motion } from 'framer-motion';
import { searchVariants } from './motion';
import { SearchMessages } from './SearchMessages';
import { ChatProfile } from './ChatProfile';
import SidebarMotionScale from '../../Sidebar/ui/SidebarMotionScale/SidebarMotionScale';

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
    <AnimatePresence mode="wait" initial={false}>
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
            <SidebarMotionScale
              className="chat-sidebar__search-messages"
              key="search-messages"
            >
              <SearchMessages
                onMessageSelect={handleMessageSelect}
                setIsSearch={setIsSearchMessages}
              />
            </SidebarMotionScale>
          ) : (
            <ChatProfile setIsChatInfo={setIsChatInfo} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatSidebar;
