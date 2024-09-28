import { useEffect, useState } from 'react';
import './GroupChatProfile.css';
import { AnimatePresence, motion } from 'framer-motion';
import {
  useChatAllAvatarsLazyQuery,
  useDeleteChatAvatarMutation,
} from './group-chat-profile.generated';
import { useAuth } from '@app/providers/hooks/useAuth';
import { CopyMessage, SuccessMessage, useCopyMessage } from '@features';
import { DrawOutline, Loader, OptionButton, Slider } from '@shared/ui';
import { FullScreenSlider, useFullScreenSlider } from '@shared/ui/Slider';
import { AvatarInfo } from '@shared/types';
import {
  EllipsisVerticalIcon,
  IdentificationIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UserGroupIcon,
  XmarkIcon,
} from '@shared/assets';
import { ChatParticipant } from './ChatParticipant/ChatParticipant';
import { useChat } from '@pages/Chat/providers/ChatProvider';
import { chatProfileVariants, deleteChatButtonVariants } from '../motion';
import { useDeleteChatMutation } from '../chat-profile.generated';
import { useNavigate } from 'react-router-dom';
import EditChatProfile from '../EditChatProfile/EditChatProfile';
import SidebarMotionSlide from '../../../../../Sidebar/ui/SidebarMotionSlide/SidebarMotionSlide';
import SidebarMotionScale from '../../../../../Sidebar/ui/SidebarMotionScale/SidebarMotionScale';

interface GroupChatProfileProps {
  isSearchUsers: boolean;
  setIsSearchUsers: (isSearchUsers: boolean) => void;
  setIsChatInfo: (isChatInfo: boolean) => void;
}

const GroupChatProfile = ({
  isSearchUsers,
  setIsSearchUsers,
  setIsChatInfo,
}: GroupChatProfileProps) => {
  const [avatars, setAvatars] = useState<AvatarInfo[]>([]);
  const [avatarsUrls, setAvatarsUrls] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string[]>([]);
  const [isActionClicked, setIsActionClicked] = useState(false);
  const [isEditChat, setIsEditChat] = useState(false);
  const { copyMessage, handleCopy } = useCopyMessage();
  const { user } = useAuth();
  const { chat } = useChat();
  const navigate = useNavigate();
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
  const [deleteChat, { loading: deleteChatLoading }] = useDeleteChatMutation();

  useEffect(() => {
    const fetchChat = async () => {
      const { data } = await allAvatars({
        variables: {
          chatId: chat?.id as string,
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

  if (!chat) return null;

  const handleDeleteAvatar = async (url: string) => {
    try {
      await deleteAvatar({
        variables: {
          chatId: chat.id,
          avatarUrl: url,
        },
      });

      removeImage(url);
      setAvatars(avatars.filter((avatar) => avatar.url !== url));
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

  const handleDeleteChat = async () => {
    await deleteChat({
      variables: {
        chatId: chat.id,
      },
      update: (cache, { data }) => {
        const isDeleted = data?.deleteChat;
        if (!isDeleted) return;

        cache.modify({
          fields: {
            userChats(existingChats = [], { readField }) {
              return existingChats.filter(
                (chatRef: any) => readField('id', chatRef) !== chat.id,
              );
            },
          },
        });
      },
    });
    navigate('/');
  };

  const handleEditClick = () => {
    setIsEditChat(true);
  };

  const handleActionClick = () => {
    setIsActionClicked(!isActionClicked);
  };

  return (
    <AnimatePresence mode="wait">
      {isEditChat ? (
        <SidebarMotionSlide
          className="chat-sidebar__profile-settings"
          key="group-chat-profile-edit"
        >
          <EditChatProfile setIsEditChat={setIsEditChat} />
        </SidebarMotionSlide>
      ) : (
        <SidebarMotionScale
          className="chat-sidebar__profile-settings"
          key="group-chat-profile"
        >
          <div className="group-chat-profile">
            <FullScreenSlider
              isOpen={isOpen}
              currentImage={currentImage}
              images={images}
              headerContent={headerContent}
              onClose={closeSlider}
              onNavigate={navigateSlider}
              onDelete={
                user?.uuid === chat.userUuid ? handleDeleteAvatar : undefined
              }
              isLoading={loadingDeleteAvatar}
            />
            <CopyMessage copyMessage={copyMessage} />
            {successMessage.length > 0 && (
              <SuccessMessage
                successMessage={successMessage}
                setSuccessMessage={setSuccessMessage}
              />
            )}
            {deleteChatLoading && <Loader />}
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
                {chat.userUuid === user?.uuid && (
                  <>
                    <OptionButton
                      className="close-button"
                      onClick={handleEditClick}
                    >
                      <abbr title="Редактировать профиль чата">
                        <PencilIcon />
                      </abbr>
                    </OptionButton>
                    <OptionButton
                      className="close-button action"
                      onClick={handleActionClick}
                    >
                      <abbr title="Действия">
                        <EllipsisVerticalIcon />
                      </abbr>
                    </OptionButton>
                    <AnimatePresence mode="wait">
                      {isActionClicked && (
                        <motion.div
                          className="action-button"
                          key="deleteChatButton"
                          variants={deleteChatButtonVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <div
                            className="action-button__text"
                            onClick={handleDeleteChat}
                          >
                            <TrashIcon />
                            <p>Удалить чат</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
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
                    <UserGroupIcon />
                  ) : avatars.length > 1 ? (
                    <Slider
                      images={avatarsUrls}
                      onImageClick={handleImageClick}
                    />
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
              <div className="participants">
                <div className="subtitle">
                  <p>Участники</p>
                  {chat.userUuid === user?.uuid && (
                    <OptionButton onClick={() => setIsSearchUsers(true)}>
                      <abbr title="Добавить участников">
                        <PlusIcon />
                      </abbr>
                    </OptionButton>
                  )}
                </div>
                <div className="participants-list">
                  {chat.participants.map((participant) => (
                    <ChatParticipant
                      key={participant.id}
                      chat={chat}
                      participant={participant}
                      setSuccessMessage={setSuccessMessage}
                    />
                  ))}
                </div>
              </div>
            </main>
          </div>
        </SidebarMotionScale>
      )}
    </AnimatePresence>
  );
};

export default GroupChatProfile;
