import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './ProfileInfo.css';
import { Slider } from '@features';
import {
  ArrowLeftIcon,
  AtSymbolIcon,
  DrawOutline,
  EllipsisVerticalIcon,
  ExclamationCircleIcon,
  ExitIcon,
  IdentificationIcon,
  Loader,
  OptionButton,
  PencilIcon,
  UserIcon,
} from '@shared/ui';
import { logoutButtonVariants } from '../motion';
import { useFullScreen } from '@app/providers/hooks/useFullScreen';
import { useProfile } from '@app/providers/hooks/useProfile';
import { useAuth } from '@app/providers/hooks/useAuth';

interface ProfileInfoProps {
  handleBackClick: () => void;
  setIsProfileInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileInfo: FC<ProfileInfoProps> = ({
  handleBackClick,
  setIsProfileInfo,
}) => {
  const [copyMessage, setCopyMessage] = useState('');
  const [isExitClicked, setIsExitClicked] = useState(false);
  const navigate = useNavigate();
  const { openFullScreen } = useFullScreen();
  const {
    avatarUrl,
    errorQueryAvatar,
    allAvatars,
    avatarUrls,
    handleDeleteAvatar,
    profileLoadingStates,
  } = useProfile();
  const { user, logout, loadingStates } = useAuth();

  const handleImageClick = (index: number) => {
    const headerContent = (
      <div className="profile-info__header">
        <div className="header__info">
          <div className="header__avatar">
            {avatarUrl ? <img src={avatarUrl} alt="avatar" /> : <UserIcon />}
          </div>
          <div className="header__name">
            <span>{user?.name}</span>
          </div>
        </div>
      </div>
    );
    openFullScreen(
      allAvatars,
      allAvatars[index],
      headerContent,
      true,
      handleDeleteAvatar,
    );
  };

  const handlePencilClick = () => {
    setIsProfileInfo(false);
  };

  const handleExitClick = () => {
    if (isExitClicked) {
      setIsExitClicked(false);
    } else {
      setIsExitClicked(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyMessage('Содержимое скопировано!');
        setTimeout(() => setCopyMessage(''), 3000);
      })
      .catch((err) => console.error('Ошибка копирования текста:', err));
  };

  return (
    <>
      {(loadingStates.logOut || profileLoadingStates.profileData) && <Loader />}
      {copyMessage && (
        <div className="copy-message">
          <ExclamationCircleIcon />
          <p>{copyMessage}</p>
        </div>
      )}
      <div className="profile-settings">
        <DrawOutline orientation="horizontal" position="bottom">
          <div className="profile-settings__header">
            <OptionButton className="back" onClick={handleBackClick}>
              <abbr title="Назад">
                <ArrowLeftIcon />
              </abbr>
            </OptionButton>
            <div className="settings-title">
              <p>Профиль</p>
              <div className="settings-title_buttons">
                <OptionButton
                  className="edit-button"
                  onClick={handlePencilClick}
                >
                  <abbr title="Редактировать профиль">
                    <PencilIcon />
                  </abbr>
                </OptionButton>
                <OptionButton className="exit-button" onClick={handleExitClick}>
                  <abbr title="Действия">
                    <EllipsisVerticalIcon />
                  </abbr>
                </OptionButton>
              </div>
            </div>
          </div>
        </DrawOutline>
        <AnimatePresence>
          {isExitClicked && (
            <motion.div
              className="logout-button"
              key="logoutButton"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={logoutButtonVariants}
            >
              <div className="logout-button__text" onClick={handleLogout}>
                <ExitIcon />
                <p>Выход</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="profile-settings__main">
          <DrawOutline
            className="all-avatars-wrapper"
            orientation="horizontal"
            position="bottom"
          >
            <div className="avatar">
              {errorQueryAvatar || !avatarUrl ? (
                <UserIcon />
              ) : allAvatars.length > 1 ? (
                <>
                  <Slider images={avatarUrls} onImageClick={handleImageClick} />
                </>
              ) : (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  onClick={() => handleImageClick(0)}
                />
              )}
            </div>
          </DrawOutline>
          <div className="credentials">
            <motion.div
              whileTap={{ scale: 1.05 }}
              className="name"
              onClick={() => handleCopy(user?.name as string)}
            >
              <IdentificationIcon />
              <div className="name-text">
                <p>{user?.name}</p>
                <p className="subtitle">Имя</p>
              </div>
            </motion.div>
            <motion.div
              whileTap={{ scale: 1.05 }}
              className="email"
              onClick={() => handleCopy(user?.email as string)}
            >
              <AtSymbolIcon />
              <div className="email-text">
                <p>{user?.email}</p>
                <p className="subtitle">E-mail</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
