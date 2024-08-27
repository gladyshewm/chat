import { motion } from 'framer-motion';
import { AvatarInfo, ChatWithoutMessages } from '@shared/types';
import {
  useChatAllAvatarsLazyQuery,
  useDeleteChatAvatarMutation,
} from './group-chat-profile.generated';
import { CopyMessage, useCopyMessage } from '@features';
import { DrawOutline, Loader, Slider } from '@shared/ui';
import { IdentificationIcon, UserGroupIcon } from '@shared/assets';
import { useEffect, useState } from 'react';
import { useFullScreen } from '@app/providers/hooks/useFullScreen';
import { useAuth } from '@app/providers/hooks/useAuth';

interface GroupChatProfileProps {
  chat: ChatWithoutMessages;
}

const GroupChatProfile = ({ chat }: GroupChatProfileProps) => {
  const [avatars, setAvatars] = useState<AvatarInfo[]>([]);
  const [avatarsUrls, setAvatarsUrls] = useState<string[]>([]);
  const { copyMessage, handleCopy } = useCopyMessage();
  const { openFullScreen } = useFullScreen();
  const { user } = useAuth();

  const [allAvatars, { loading: loadingAllAvatars, error: errorAllAvatars }] =
    useChatAllAvatarsLazyQuery();
  const [
    deleteAvatar,
    { loading: loadingDeleteAvatar, error: errorDeleteAvatar },
  ] = useDeleteChatAvatarMutation();

  useEffect(() => {
    const fetchChat = async () => {
      const { data } = await allAvatars({
        variables: {
          chatId: chat.id,
        },
      });

      if (!data || !data.chatAllAvatars) return;

      setAvatars(data.chatAllAvatars as AvatarInfo[]);
      setAvatarsUrls(
        data.chatAllAvatars.map((avatar) => {
          if (!avatar) return '';
          return avatar.url;
        }),
      );
    };

    fetchChat();
  }, [allAvatars, chat]);

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar({
        variables: {
          chatId: chat.id,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  const handleImageClick = (index: number) => {
    const headerContent = (
      <div className="profile-info__header">
        <div className="header__info">
          <div className="header__avatar">
            {chat.groupAvatarUrl ? (
              <img src={chat.groupAvatarUrl} alt="avatar" />
            ) : (
              <UserGroupIcon />
            )}
          </div>
          <div className="header__name">
            <span>{chat.name}</span>
          </div>
        </div>
      </div>
    );

    if (user?.uuid === chat.userUuid) {
      openFullScreen(
        avatars,
        avatars[index],
        headerContent,
        true,
        handleDeleteAvatar,
      );
    } else {
      openFullScreen(avatars, avatars[index], headerContent, false);
    }
  };

  return (
    <>
      <CopyMessage copyMessage={copyMessage} />
      <main className="profile-settings__main">
        <DrawOutline
          className="all-avatars-wrapper"
          orientation="horizontal"
          position="bottom"
        >
          <div className="avatar">
            {loadingAllAvatars && <Loader />}
            {errorAllAvatars || !avatars.length ? (
              <UserGroupIcon />
            ) : avatars.length > 1 ? (
              <>
                <Slider images={avatarsUrls} onImageClick={handleImageClick} />
              </>
            ) : (
              chat.groupAvatarUrl && (
                <img
                  src={chat.groupAvatarUrl}
                  alt="avatar"
                  onClick={() => handleImageClick(0)}
                />
              )
            )}
          </div>
        </DrawOutline>
        <div className="credentials">
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="name"
            onClick={() => handleCopy(chat.name as string)}
          >
            <IdentificationIcon />
            <div className="name-text">
              <p>{chat.name}</p>
              <p className="subtitle">Название чата</p>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default GroupChatProfile;
