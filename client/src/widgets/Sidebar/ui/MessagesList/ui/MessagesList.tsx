import React, { useState } from 'react';
import './MessagesList.css';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  useFindUsersLazyQuery,
  useUserChatsQuery,
  useUserChatsSubSubscription,
} from './messagesList.generated';
import { ChatWithoutMessages, UserWithAvatar } from '@shared/types';
import { createChatButtonVariants } from './motion';
import { useAuth } from '@app/providers/hooks/useAuth';
import { PlusIcon } from '@shared/assets';
import Chats from './Chats/Chats';
import { Search } from './Search';
import CreateChat from './CreateChat/CreateChat';
import MessagesListHeader from './MessagesListHeader/MessagesListHeader';
import SidebarMotionScale from '../../SidebarMotionScale/SidebarMotionScale';
import SidebarMotionSlide from '../../SidebarMotionSlide/SidebarMotionSlide';

interface MessagesListProps {
  setIsProfileSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

const MessagesList = ({ setIsProfileSettings }: MessagesListProps) => {
  const [chats, setChats] = useState<ChatWithoutMessages[] | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [searchData, setSearchData] = useState<UserWithAvatar[] | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isCreateChat, setIsCreateChat] = useState(false);
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const [findUsers, { loading: searchLoading, error: searchError }] =
    useFindUsersLazyQuery();

  const { loading: chatsLoading, error: chatsError } = useUserChatsQuery({
    onCompleted: (data) => {
      if (!data.userChats) return;
      setChats(data.userChats as ChatWithoutMessages[]);
    },
    onError: (error) => {
      setChats(null);
      console.error(error);
    },
  });

  useUserChatsSubSubscription({
    onData: ({ data }) => {
      console.log(data);
      if (!data.data?.userChats) return;
      setChats(data.data.userChats as ChatWithoutMessages[]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleCreateChatClick = () => {
    setIsCreateChat(true);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isCreateChat ? (
        <SidebarMotionSlide key="createChat" style={{ height: '100%' }}>
          <CreateChat setIsCreateChat={setIsCreateChat} />
        </SidebarMotionSlide>
      ) : (
        <SidebarMotionScale key="messages-list" style={{ height: '100%' }}>
          <MessagesListHeader
            isSearch={isSearch}
            setIsSearch={setIsSearch}
            setIsProfileSettings={setIsProfileSettings}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setSearchData={setSearchData}
            findUsers={findUsers}
          />
          <AnimatePresence mode="wait">
            {isSearch ? (
              <SidebarMotionSlide key="search">
                <Search
                  searchData={searchData}
                  searchLoading={searchLoading}
                  searchError={searchError}
                  searchValue={searchValue}
                />
              </SidebarMotionSlide>
            ) : (
              <SidebarMotionScale
                key="messages"
                className="message-list"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="chats-container">
                  <Chats
                    user={user}
                    chats={chats}
                    chatsLoading={chatsLoading}
                    chatsError={chatsError}
                    activeChatId={id}
                  />
                  <AnimatePresence mode="wait">
                    {isHovered && (
                      <motion.button
                        className="create-chat-button"
                        key="create-chat-button"
                        onClick={handleCreateChatClick}
                        variants={createChatButtonVariants}
                        initial="hidden"
                        animate="animate"
                        exit="exit"
                        whileHover={{
                          opacity: 1,
                          transition: { duration: 0.3 },
                        }}
                      >
                        <abbr title="Создать групповой чат">
                          <PlusIcon />
                        </abbr>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </SidebarMotionScale>
            )}
          </AnimatePresence>
        </SidebarMotionScale>
      )}
    </AnimatePresence>
  );
};

export default MessagesList;
