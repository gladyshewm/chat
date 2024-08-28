import './ChatProfile.css';
import { AnimatePresence, motion } from 'framer-motion';
import { chatProfileVariants } from './motion';
import { DrawOutline, OptionButton } from '@shared/ui';
import { XmarkIcon } from '@shared/assets';
import { ChatWithoutMessages } from '@shared/types';
import SingleChatProfile from './SingleChatProfile/SingleChatProfile';
import GroupChatProfile from './GroupChatProfile/GroupChatProfile';

interface ChatProfileProps {
  setIsChatInfo: (isChatInfo: boolean) => void;
  chat: ChatWithoutMessages;
  updateChat: (chat: ChatWithoutMessages) => void;
}

const ChatProfile = ({ setIsChatInfo, chat, updateChat }: ChatProfileProps) => {
  return (
    <AnimatePresence>
      <DrawOutline
        key={'chat-profile'}
        className="search-messages__wrapper"
        orientation="vertical"
        position="left"
      >
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
          <GroupChatProfile chat={chat} updateChat={updateChat} />
        ) : (
          <SingleChatProfile chat={chat} />
        )}
      </DrawOutline>
    </AnimatePresence>
  );
};

export default ChatProfile;
