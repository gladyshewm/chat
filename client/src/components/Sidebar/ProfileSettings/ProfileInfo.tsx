import React, { FC, useState } from 'react';
import ExclamationCircleIcon from '../../../icons/ExclamationCircleIcon';
import ArrowLeftIcon from '../../../icons/ArrowLeftIcon';
import PencilIcon from '../../../icons/PencilIcon';
import EllipsisVerticalIcon from '../../../icons/EllipsisVerticalIcon';
import UserIcon from '../../../icons/UserIcon';
import IdentificationIcon from '../../../icons/IdentificationIcon';
import AtSymbolIcon from '../../../icons/AtSymbolIcon';
import { AnimatePresence, motion } from 'framer-motion';
import ExitIcon from '../../../icons/ExitIcon';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../hoc/AuthProvider';
import { ApolloError, useQuery } from '@apollo/client';
import './ProfileInfo.css';
import { GET_USER_ALL_AVATARS } from '../../../graphql/query/user';
import Slider from '../../Slider/Slider';
import DrawOutline from '../../DrawOutline/DrawOutline/DrawOutline';

interface ProfileInfoProps {
  user: User | null;
  avatarUrl: string | null;
  errorQueryAvatar: ApolloError | undefined;
  handleBackClick: () => void;
  setIsProfileInfo: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
}

const ProfileInfo: FC<ProfileInfoProps> = ({
  user,
  avatarUrl,
  errorQueryAvatar,
  handleBackClick,
  setIsProfileInfo,
  logout,
}) => {
  const [copyMessage, setCopyMessage] = useState('');
  const [isExitClicked, setIsExitClicked] = useState(false);
  const [allAvatars, setAllAvatars] = useState([]);
  const navigate = useNavigate();

  useQuery(GET_USER_ALL_AVATARS, {
    variables: {
      userUuid: user?.uuid,
    },
    skip: !user,
    onCompleted: (data) => {
      if (user) {
        setAllAvatars(data.userAllAvatars);
      }
    },
    onError: (error) => {
      if (error.message.includes('User not authorized')) {
        setAllAvatars([]);
      }
    },
  });

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

  const logoutButtonTransition = {
    type: 'spring',
    duration: 0.2,
    ease: 'linear',
  };

  const logoutButtonVariants = {
    initial: {
      opacity: 0,
      y: -10,
      transition: logoutButtonTransition,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: logoutButtonTransition,
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: logoutButtonTransition,
    },
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
                <Slider images={allAvatars} />
              ) : (
                <img src={avatarUrl} alt="avatar" />
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
