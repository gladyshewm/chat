import { useState } from 'react';
import './ChatProfile.css';
import { AnimatePresence } from 'framer-motion';
import { DrawOutline } from '@shared/ui';
import SingleChatProfile from './SingleChatProfile/SingleChatProfile';
import GroupChatProfile from './GroupChatProfile/GroupChatProfile';
import SearchUsers from './SearchUsers/SearchUsers';
import { useChat } from '@pages/Chat/providers/ChatProvider';
import SidebarMotionSlide from '../../../../Sidebar/ui/SidebarMotionSlide/SidebarMotionSlide';
import SidebarMotionScale from '../../../../Sidebar/ui/SidebarMotionScale/SidebarMotionScale';

interface ChatProfileProps {
  setIsChatInfo: (isChatInfo: boolean) => void;
}

const ChatProfile = ({ setIsChatInfo }: ChatProfileProps) => {
  const [isSearchUsers, setIsSearchUsers] = useState(false);
  const { chat } = useChat();

  if (!chat) return null;

  return (
    <AnimatePresence mode="wait">
      <DrawOutline
        key={'chat-profile'}
        className="search-messages__wrapper"
        orientation="vertical"
        position="left"
      >
        <AnimatePresence mode="wait">
          {isSearchUsers ? (
            <SidebarMotionSlide
              className="chat-sidebar__profile-settings"
              key="chat-profile"
            >
              <SearchUsers setIsSearch={setIsSearchUsers} chat={chat} />
            </SidebarMotionSlide>
          ) : (
            <>
              {chat.isGroupChat ? (
                <SidebarMotionScale
                  className="chat-sidebar__profile-settings"
                  key="group-chat-profile"
                >
                  <GroupChatProfile
                    isSearchUsers={isSearchUsers}
                    setIsSearchUsers={setIsSearchUsers}
                    setIsChatInfo={setIsChatInfo}
                  />
                </SidebarMotionScale>
              ) : (
                <SidebarMotionScale
                  className="chat-sidebar__profile-settings"
                  key="single-chat-profile"
                >
                  <SingleChatProfile setIsChatInfo={setIsChatInfo} />
                </SidebarMotionScale>
              )}
            </>
          )}
        </AnimatePresence>
      </DrawOutline>
    </AnimatePresence>
  );
};

export default ChatProfile;
