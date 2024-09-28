import { useEffect, useState } from 'react';
import "./SingleChatProfile.css";
import { motion } from 'framer-motion';
import { useAuth } from '@app/providers/hooks/useAuth';
import { useUserAllAvatarsLazyQuery } from '@app/providers/ProfileProvider/profile.generated';
import { IdentificationIcon, UserIcon, XmarkIcon } from '@shared/assets';
import { AvatarInfo, UserWithAvatar } from '@shared/types';
import { DrawOutline, Loader, OptionButton, Slider } from '@shared/ui';
import { CopyMessage, useCopyMessage } from '@features';
import { FullScreenSlider, useFullScreenSlider } from '@shared/ui/Slider';
import { useChat } from '@pages/Chat/providers/ChatProvider';
import { chatProfileVariants } from '../motion';

interface SingleChatProfileProps {
  setIsChatInfo: (isChatInfo: boolean) => void;
}

const SingleChatProfile = ({ setIsChatInfo }: SingleChatProfileProps) => {
  const { user } = useAuth();
  const [avatars, setAvatars] = useState<AvatarInfo[]>([]);
  const [avatarsUrls, setAvatarsUrls] = useState<string[]>([]);
  const [withUser, setWithUser] = useState<UserWithAvatar | null>(null);
  const { copyMessage, handleCopy } = useCopyMessage();
  const {
    openSlider,
    isOpen,
    currentImage,
    images,
    headerContent,
    closeSlider,
    navigateSlider,
  } = useFullScreenSlider();
  const { chat } = useChat();

  const [allAvatars, { loading: loadingAllAvatars, error: errorAllAvatars }] =
    useUserAllAvatarsLazyQuery();

  useEffect(() => {
    const participant: UserWithAvatar = (
      chat?.participants as UserWithAvatar[]
    ).filter((p) => p.id !== user?.uuid)[0];
    setWithUser(participant);

    if (!withUser) return;

    const fetchWithUser = async () => {
      const { data } = await allAvatars({
        variables: {
          userUuid: withUser.id,
        },
      });

      if (!data || !data.userAllAvatars) return;

      setAvatars(data.userAllAvatars as AvatarInfo[]);
      setAvatarsUrls(
        data.userAllAvatars.map((avatar) => {
          if (!avatar) return '';
          return avatar.url;
        }),
      );
    };

    fetchWithUser();
  }, [allAvatars, chat, withUser, user]);

  const handleImageClick = (index: number) => {
    const headerContent = (
      <div className="profile-info__header">
        <div className="header__info">
          {withUser && (
            <>
              <div className="header__avatar">
                {withUser.avatarUrl ? (
                  <img src={withUser.avatarUrl} alt="avatar" />
                ) : (
                  <UserIcon />
                )}
              </div>
              <div className="header__name">
                <span>{withUser.name}</span>
              </div>
            </>
          )}
        </div>
      </div>
    );

    openSlider(avatars, avatars[index], headerContent);
  };

  return (
    <div className="single-chat-profile">
      <FullScreenSlider
        isOpen={isOpen}
        currentImage={currentImage}
        images={images}
        headerContent={headerContent}
        onClose={closeSlider}
        onNavigate={navigateSlider}
      />
      <CopyMessage copyMessage={copyMessage} />
      <DrawOutline orientation="horizontal" position="bottom">
        <motion.header
          className="chat-profile__header"
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
      <main className="profile-settings__main">
        <DrawOutline
          className="all-avatars-wrapper"
          orientation="horizontal"
          position="bottom"
        >
          <div className="avatar">
            {loadingAllAvatars && <Loader />}
            {errorAllAvatars || !avatars.length ? (
              <UserIcon />
            ) : avatars.length > 1 ? (
              <>
                <Slider images={avatarsUrls} onImageClick={handleImageClick} />
              </>
            ) : (
              withUser &&
              withUser.avatarUrl && (
                <img
                  src={withUser.avatarUrl}
                  alt="avatar"
                  onClick={() => handleImageClick(0)}
                />
              )
            )}
          </div>
        </DrawOutline>
        {withUser && (
          <div className="credentials">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="name"
              onClick={() => handleCopy(withUser.name)}
            >
              <IdentificationIcon />
              <div className="name-text">
                <p>{withUser.name}</p>
                <p className="subtitle">Имя</p>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SingleChatProfile;
