import { useEffect, useState } from 'react';
import './ChatHeader.css';
import { motion } from 'framer-motion';
import {
  ChatWithoutMessages,
  TypingFeedback,
  UserInfo,
  UserWithAvatar,
} from '@shared/types';
import { DrawOutlineRect, OptionButton } from '@shared/ui';
import {
  EllipsisVerticalIcon,
  PencilIcon,
  SearchIcon,
  UserGroupIcon,
  UserIcon,
  XmarkIcon,
} from '@shared/assets';
import { formatParticipants } from '../../utils';
import { useUserTypingSubscription } from '../chat.generated';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  chat: ChatWithoutMessages;
  user: UserInfo | null;
  setIsSearch: (isSearch: boolean) => void;
  setIsChatInfo: (isChatInfo: boolean) => void;
}

const ChatHeader = ({
  user,
  setIsSearch,
  setIsChatInfo,
  chat,
}: ChatHeaderProps) => {
  const [typingStatus, setTypingStatus] = useState<TypingFeedback | null>(null);
  const [withUser, setWithUser] = useState<UserWithAvatar | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!chat) return;

    if (!chat.isGroupChat) {
      setWithUser(chat.participants.filter((p) => p.id !== user?.uuid)[0]);
    }
  }, [chat, user]);

  useUserTypingSubscription({
    variables: {
      chatId: chat?.id as string,
    },
    onData: (userTypingData) => {
      const typingStatus = userTypingData.data.data
        ?.userTyping as TypingFeedback;
      setTypingStatus(typingStatus);
    },
  });

  const handleCloseButton = () => {
    navigate('/');
  };

  if (!chat) return null;

  return (
    <motion.header className="chat__header">
      <motion.div className="main">
        <DrawOutlineRect className="avatar-wrapper" rx="50%">
          <motion.div
            className="chat__avatar"
            onClick={() => setIsChatInfo(true)}
          >
            {chat.isGroupChat ? (
              chat.groupAvatarUrl ? (
                <img src={`${chat.groupAvatarUrl}`} alt="chat-avatar" />
              ) : (
                <UserGroupIcon />
              )
            ) : withUser && withUser.avatarUrl ? (
              <img src={`${withUser.avatarUrl}`} alt="chat-avatar" />
            ) : (
              <UserIcon />
            )}
          </motion.div>
        </DrawOutlineRect>
        <motion.div className="chat__info" onClick={() => setIsChatInfo(true)}>
          <span className="chat__name">
            {chat.isGroupChat ? chat.name : withUser?.name}
          </span>
          {chat.isGroupChat && (
            <motion.div className="chat__count">
              {formatParticipants(chat.participants.length)}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      {typingStatus?.isTyping && typingStatus.userName !== user?.name && (
        <motion.div className="feedback">
          <span>{typingStatus.userName}...</span>
          <PencilIcon />
        </motion.div>
      )}
      <motion.div className="buttons">
        <OptionButton className="search" onClick={() => setIsSearch(true)}>
          <abbr title="Поиск сообщений">
            <SearchIcon />
          </abbr>
        </OptionButton>
        <OptionButton>
          <abbr title="Настройки">
            <EllipsisVerticalIcon />
          </abbr>
        </OptionButton>
        <OptionButton className="close-button" onClick={handleCloseButton}>
          <abbr title="Закрыть чат">
            <XmarkIcon />
          </abbr>
        </OptionButton>
      </motion.div>
    </motion.header>
  );
};

export default ChatHeader;
