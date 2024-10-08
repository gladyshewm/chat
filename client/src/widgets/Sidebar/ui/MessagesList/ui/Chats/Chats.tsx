import { Link } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import './Chats.css';
import { motion } from 'framer-motion';
import { ChatWithoutMessages, UserInfo } from '@shared/types';
import { DrawOutlineRect, Loader, NoChatsIllustration } from '@shared/ui';
import { UserGroupIcon, UserIcon } from '@shared/assets';

interface GroupChatProps {
  chat: ChatWithoutMessages;
  activeChatId: string | undefined;
}

const GroupChat = ({ chat, activeChatId }: GroupChatProps) => (
  <div className="group-chat">
    {chat.groupAvatarUrl ? (
      <DrawOutlineRect
        className="avatar-wrapper"
        strokeWidth={1}
        rx="50%"
        isActive={chat.id === activeChatId}
      >
        <div className="chat-avatar">
          <img src={chat.groupAvatarUrl} alt="chat-avatar" />
        </div>
      </DrawOutlineRect>
    ) : (
      <DrawOutlineRect
        className="avatar-wrapper"
        strokeWidth={1}
        rx="50%"
        isActive={chat.id === activeChatId}
      >
        <div className="empty-chat-avatar">
          <UserGroupIcon />
        </div>
      </DrawOutlineRect>
    )}
    <p className={`chat-name ${chat.id === activeChatId ? 'active' : ''}`}>
      {chat.name}
    </p>
  </div>
);

interface UserChatProps {
  chat: ChatWithoutMessages;
  currentUserId: string;
  activeChatId: string | undefined;
}

const UserChat = ({ chat, currentUserId, activeChatId }: UserChatProps) => {
  const otherParticipant = chat.participants.find(
    (participant) => participant.id !== currentUserId,
  );

  return (
    <div className="user-chat">
      {otherParticipant?.avatarUrl ? (
        <DrawOutlineRect
          className="avatar-wrapper"
          strokeWidth={1}
          rx="50%"
          isActive={chat.id === activeChatId}
        >
          <div className="chat-avatar">
            <img src={otherParticipant.avatarUrl} alt="user-avatar" />
          </div>
        </DrawOutlineRect>
      ) : (
        <DrawOutlineRect
          className="avatar-wrapper"
          strokeWidth={1}
          rx="50%"
          isActive={chat.id === activeChatId}
        >
          <div className="empty-chat-avatar">
            <UserIcon />
          </div>
        </DrawOutlineRect>
      )}
      <p className={`chat-name ${chat.id === activeChatId ? 'active' : ''}`}>
        {otherParticipant?.name}
      </p>
    </div>
  );
};

interface ChatsProps {
  user: UserInfo | null;
  chats: ChatWithoutMessages[] | null;
  chatsLoading: boolean;
  chatsError: ApolloError | undefined;
  activeChatId: string | undefined;
}

const Chats = ({
  user,
  chats,
  chatsLoading,
  chatsError,
  activeChatId,
}: ChatsProps) => {
  if (chatsLoading) return <Loader />;
  if (chatsError) return <p>Error</p>;
  if (!chats || chats.length === 0)
    return (
      <div className="no-chats-block">
        <NoChatsIllustration />
        <p>Не найдено ни одного чата</p>
      </div>
    );

  return chats.map((chat) => (
    <motion.div key={chat.id} whileTap={{ scale: 0.95 }}>
      <DrawOutlineRect
        className="message-list-wrapper"
        rx="15px"
        stroke="#fff"
        strokeWidth={1}
        showOnHover={true}
        isActive={chat.id === activeChatId}
      >
        <Link
          to={`/chat/${chat.id}`}
          className={`message-list-block ${chat.id === activeChatId ? 'active' : ''}`}
        >
          {chat.isGroupChat ? (
            <GroupChat chat={chat} activeChatId={activeChatId} />
          ) : (
            <UserChat
              chat={chat}
              currentUserId={user?.uuid || ''}
              activeChatId={activeChatId}
            />
          )}
        </Link>
      </DrawOutlineRect>
    </motion.div>
  ));
};

export default Chats;
