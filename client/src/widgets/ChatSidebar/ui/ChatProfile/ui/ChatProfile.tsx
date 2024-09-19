import { useState } from 'react';
import './ChatProfile.css';
import { AnimatePresence, motion } from 'framer-motion';
import { chatProfileVariants } from './motion';
import { DrawOutline, OptionButton } from '@shared/ui';
import { XmarkIcon } from '@shared/assets';
import SingleChatProfile from './SingleChatProfile/SingleChatProfile';
import GroupChatProfile from './GroupChatProfile/GroupChatProfile';
import SearchUsers from './SearchUsers/SearchUsers';
import { useChat } from '@pages/Chat/ctx/ChatContext';

interface ChatProfileProps {
  setIsChatInfo: (isChatInfo: boolean) => void;
}

const ChatProfile = ({ setIsChatInfo }: ChatProfileProps) => {
  const [isSearchUsers, setIsSearchUsers] = useState(false);
  const { chat } = useChat();

  if (!chat) return null;

  return (
    <AnimatePresence>
      <DrawOutline
        key={'chat-profile'}
        className="search-messages__wrapper"
        orientation="vertical"
        position="left"
      >
        {isSearchUsers ? (
          <SearchUsers setIsSearch={setIsSearchUsers} chat={chat} />
        ) : (
          <>
            <DrawOutline orientation="horizontal" position="bottom">
              <motion.header
                id="chat-profile__header"
                variants={chatProfileVariants}
                initial="hidden"
                animate="visible"
              >
                <OptionButton
                  className="close-button"
                  onClick={() => setIsChatInfo(false)}
                >
                  <abbr title="Закрыть">
                    <XmarkIcon />
                  </abbr>
                </OptionButton>
                <div className="chat-profile__title">
                  <p>Информация</p>
                </div>
              </motion.header>
            </DrawOutline>
            {chat.isGroupChat ? (
              <GroupChatProfile
                isSearchUsers={isSearchUsers}
                setIsSearchUsers={setIsSearchUsers}
              />
            ) : (
              <SingleChatProfile />
            )}
          </>
        )}
      </DrawOutline>
    </AnimatePresence>
  );
};

export default ChatProfile;
