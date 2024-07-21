import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './ProfileInfo.css';
import { useFullScreen } from '../../../../hooks/useFullScreen';
import { useProfile } from '../../../../hooks/useProfile';
import useAuth from '../../../../hooks/useAuth';
import ExclamationCircleIcon from '../../../../icons/ExclamationCircleIcon';
import ArrowLeftIcon from '../../../../icons/ArrowLeftIcon';
import PencilIcon from '../../../../icons/PencilIcon';
import EllipsisVerticalIcon from '../../../../icons/EllipsisVerticalIcon';
import UserIcon from '../../../../icons/UserIcon';
import IdentificationIcon from '../../../../icons/IdentificationIcon';
import AtSymbolIcon from '../../../../icons/AtSymbolIcon';
import ExitIcon from '../../../../icons/ExitIcon';
import Slider from '../../../Slider/Slider';
import DrawOutline from '../../../DrawOutline/DrawOutline/DrawOutline';
import { logoutButtonVariants } from '../../../../motion';

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
  } = useProfile();
  const { user, logout } = useAuth();

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
      {copyMessage && (
        <div className="copy-message">
          <ExclamationCircleIcon />
          <p>{copyMessage}</p>
        </div>
      )}
      <div className="profile-settings">
        <DrawOutline orientation="horizontal" position="bottom">
          <div className="profile-settings__header">
            <button className="back" onClick={handleBackClick}>
              <ArrowLeftIcon />
            </button>
            <div className="settings-title">
              <p>Профиль</p>
              <div className="settings-title_buttons">
                <button
                  className="edit-button"
                  onClick={() => handlePencilClick()}
                >
                  <PencilIcon />
                </button>
                <button
                  className="exit-button"
                  onClick={() => handleExitClick()}
                >
                  <EllipsisVerticalIcon />
                </button>
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
