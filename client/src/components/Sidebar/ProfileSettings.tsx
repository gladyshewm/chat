import React, { FC, useState } from 'react';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import PencilIcon from '../icons/PencilIcon';
import EllipsisVerticalIcon from '../icons/EllipsisVerticalIcon';
import UserIcon from '../icons/UserIcon';
import IdentificationIcon from '../icons/IdentificationIcon';
import AtSymbolIcon from '../icons/AtSymbolIcon';
import { ApolloError } from '@apollo/client';
import { User } from '../../hoc/AuthProvider';
import ExclamationCircleIcon from '../icons/ExclamationCircleIcon';

interface ProfileSettingsProps {
  user: User | null;
  avatarUrl: string;
  errorQueryAvatar: ApolloError | undefined;
  setIsProfileSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileSettings: FC<ProfileSettingsProps> = ({
  user,
  avatarUrl,
  errorQueryAvatar,
  setIsProfileSettings,
}) => {
  const [copyMessage, setCopyMessage] = useState('');
  const handleAvatarClick = () => {
    setIsProfileSettings(true);
  };

  const handleBackClick = () => {
    setIsProfileSettings(false);
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
              <button>
                <PencilIcon />
              </button>
              <button>
                <EllipsisVerticalIcon />
              </button>
            </div>
          </div>
        </div>
        <div className="profile-settings__main">
          <div onClick={handleAvatarClick} className="avatar">
            {errorQueryAvatar || !avatarUrl.length ? (
              <UserIcon />
            ) : (
              <img src={avatarUrl} alt="avatar" />
            )}
          </div>
          <div className="credentials">
            <div
              className="name"
              onClick={() => handleCopy(user?.name as string)}
            >
              <IdentificationIcon />
              <div className="name-text">
                <p>{user?.name}</p>
                <p className="subtitle">Имя</p>
              </div>
            </div>
            <div
              className="email"
              onClick={() => handleCopy(user?.email as string)}
            >
              <AtSymbolIcon />
              <div className="email-text">
                <p>{user?.email}</p>
                <p className="subtitle">E-mail</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;
