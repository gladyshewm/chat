import React, { FC, useState } from 'react';
import './EditProfile.css';
import ArrowLeftIcon from '../../../icons/ArrowLeftIcon';
import { ApolloError, useMutation } from '@apollo/client';
import CameraIcon from '../../../icons/CameraIcon';
import XmarkIcon from '../../../icons/XmarkIcon';
import CheckIcon from '../../../icons/CheckIcon';
import { User } from '../../../hoc/AuthProvider';
import { UPLOAD_AVATAR } from '../../../graphql/mutations/user';

interface EditProfileProps {
  user: User | null;
  avatarUrl: string | null;
  setAvatarUrl: React.Dispatch<React.SetStateAction<string | null>>;
  errorQueryAvatar: ApolloError | undefined;
  setIsProfileInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfile: FC<EditProfileProps> = ({
  user,
  avatarUrl,
  setAvatarUrl,
  errorQueryAvatar,
  setIsProfileInfo,
}) => {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [uploadAvatar] = useMutation(UPLOAD_AVATAR);

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
    if (user && avatar) {
      try {
        const { data } = await uploadAvatar({
          variables: {
            image: avatar,
            userUuid: user.uuid,
          },
        });
        const newAvatarUrl = data.uploadAvatar;
        setAvatarUrl(newAvatarUrl);
        setAvatar(null);
      } catch (error) {
        console.error(error);
      }
    }
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
      <div className="edit-profile__header">
        <button className="back" onClick={handleBackClick}>
          <ArrowLeftIcon />
        </button>
        <div className="edit-profile__title">
          <p>Редактирование профиля</p>
        </div>
      </div>
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
        <div className="credentials">asdsa</div>
      </div>
    </div>
  );
};

export default EditProfile;
