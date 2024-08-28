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
import { useAuth } from '@app/providers/hooks/useAuth';
import { FullScreenSlider, useFullScreenSlider } from '@shared/ui/Slider';

interface GroupChatProfileProps {
  chat: ChatWithoutMessages;
  updateChat: (chat: ChatWithoutMessages) => void;
}

const GroupChatProfile = ({ chat, updateChat }: GroupChatProfileProps) => {
  const [avatars, setAvatars] = useState<AvatarInfo[]>([]);
  const [avatarsUrls, setAvatarsUrls] = useState<string[]>([]);
  const { copyMessage, handleCopy } = useCopyMessage();
  const { user } = useAuth();
  const {
    openSlider,
    isOpen,
    currentImage,
    images,
    headerContent,
    closeSlider,
    navigateSlider,
    removeImage,
  } = useFullScreenSlider();

  const [allAvatars, { loading: loadingAllAvatars, error: errorAllAvatars }] =
    useChatAllAvatarsLazyQuery();
  const [deleteAvatar, { loading: loadingDeleteAvatar }] =
    useDeleteChatAvatarMutation();

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

  const handleDeleteAvatar = async (url: string) => {
    try {
      const { data } = await deleteAvatar({
        variables: {
          chatId: chat.id,
          avatarUrl: url,
        },
      });

      removeImage(url);
      setAvatars(avatars.filter((avatar) => avatar.url !== url));

      const updatedChat = {
        ...chat,
        groupAvatarUrl: data?.deleteChatAvatar,
      };
      updateChat(updatedChat);
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

    openSlider(avatars, avatars[index], headerContent);
  };

  return (
    <>
      <FullScreenSlider
        isOpen={isOpen}
        currentImage={currentImage}
        images={images}
        headerContent={headerContent}
        onClose={closeSlider}
        onNavigate={navigateSlider}
        onDelete={user?.uuid === chat.userUuid ? handleDeleteAvatar : undefined}
        isLoading={loadingDeleteAvatar}
      />
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
