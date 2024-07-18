import React, { FC, useState } from 'react';
import './EditProfile.css';
import ArrowLeftIcon from '../../../../icons/ArrowLeftIcon';
import CameraIcon from '../../../../icons/CameraIcon';
import XmarkIcon from '../../../../icons/XmarkIcon';
import CheckIcon from '../../../../icons/CheckIcon';
import DrawOutline from '../../../DrawOutline/DrawOutline/DrawOutline';
import { useProfile } from '../../../../hooks/useProfile';
import useAuth from '../../../../hooks/useAuth';

interface EditProfileProps {
  setIsProfileInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfile: FC<EditProfileProps> = ({ setIsProfileInfo }) => {
  const [avatar, setAvatar] = useState<File | null>(null);
  const { avatarUrl, errorQueryAvatar, handleUploadAvatar } = useProfile();
  const { user } = useAuth();

  const handleBackClick = () => {
    setIsProfileInfo(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(event.target.files[0]);
    }
  };

  const handleCancel = () => {
    setAvatar(null);
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await handleUploadAvatar(avatar as File);
    setAvatar(null);
  };

  const handleDivClick = () => {
    const fileInput = document.getElementById(
      'avatarInput',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="edit-profile">
      <DrawOutline orientation="horizontal" position="bottom">
        <div className="edit-profile__header">
          <button className="back" onClick={handleBackClick}>
            <ArrowLeftIcon />
          </button>
          <div className="edit-profile__title">
            <p>Редактирование профиля</p>
          </div>
        </div>
      </DrawOutline>
      <div className="edit-profile__main">
        <div className="avatar">
          <input
            type="file"
            id="avatarInput"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {avatar ? (
            <div className="preview-avatar">
              <img src={URL.createObjectURL(avatar)} alt="new avatar" />
              <div className="avatar-buttons">
                <button className="cancel" onClick={handleCancel}>
                  <XmarkIcon />
                </button>
                <button
                  className="save"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleSave(e)
                  }
                >
                  <CheckIcon />
                </button>
              </div>
            </div>
          ) : errorQueryAvatar || !avatarUrl ? (
            <div className="empty-avatar" onClick={handleDivClick}>
              <CameraIcon />
            </div>
          ) : (
            <div className="update-avatar" onClick={handleDivClick}>
              <CameraIcon />
              <img src={avatarUrl as string} alt="avatar" />
            </div>
          )}
        </div>
        <div className="credentials">
          <label className="input">
            <input
              className="input__field"
              id="name"
              name="name"
              type="text"
              placeholder=" "
              defaultValue={user?.name}
            />
            <span className="input__label">Имя (обязательно)</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
