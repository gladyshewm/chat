import React, { FC, useEffect, useState } from 'react';
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
  const navigate = useNavigate();
  const { data, error, loading, refetch } = useQuery(GET_USER_ALL_AVATARS, {
    variables: {
      userUuid: user?.uuid,
    },
  });

  useEffect(() => {
    if (!loading && !error && data) {
      console.log(data);
    }
  }, [data, loading, error]);

  const SlideShow = ({ image }: { image: { src: string } }) => {
    return (
      <AnimatePresence>
        <motion.img
          key={image.src}
          src={image.src}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
        />
      </AnimatePresence>
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
          {copyMessage}
        </div>
      )}
      <div className="profile-settings">
        <div className="profile-settings__header">
          <button className="back" onClick={handleBackClick}>
            <ArrowLeftIcon />
          </button>
          <div className="settings-title">
            <p>Настройки</p>
            <div className="settings-title_buttons">
              <button
                className="edit-button"
                onClick={() => handlePencilClick()}
              >
                <PencilIcon />
              </button>
              <button className="exit-button" onClick={() => handleExitClick()}>
                <EllipsisVerticalIcon />
              </button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isExitClicked && (
            <motion.div
              className="logout-button"
              key="logoutButton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="logout-button__text" onClick={handleLogout}>
                <ExitIcon />
                <p>Выход</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="profile-settings__main">
          <div className="avatar">
            {errorQueryAvatar || !avatarUrl ? (
              <UserIcon />
            ) : (
              <img src={avatarUrl} alt="avatar" />
            )}
          </div>
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
