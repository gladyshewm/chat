import React, { useEffect, useState } from 'react';
import './AvatarUploader.css';
import { CameraIcon, CheckIcon, XmarkIcon } from '@shared/assets';
import { DrawOutlineRect, Loader, OptionButton } from '@shared/ui';
import { ApolloError } from '@apollo/client';

interface AvatarUploaderProps {
  initialAvatarUrl?: string;
  onSave: (file: File) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: ApolloError | undefined;
  clearAfterSave?: boolean;
  selectedAvatar?: File | null;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  initialAvatarUrl,
  onSave,
  onCancel,
  isLoading = false,
  error,
  clearAfterSave = true,
  selectedAvatar,
}) => {
  const [avatar, setAvatar] = useState<File | null>(null);

  useEffect(() => {
    if (selectedAvatar) {
      setAvatar(selectedAvatar);
    }
  }, [selectedAvatar]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type.startsWith('image/')) {
        setAvatar(file);
      } else {
        alert('Недопустимый тип файла. Пожалуйста, выберите изображение.');
        event.target.value = '';
      }
    }
  };

  const handleCancel = () => {
    setAvatar(null);
    if (onCancel) onCancel();
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (avatar) {
      await onSave(avatar);

      if (clearAfterSave) {
        setAvatar(null);
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

  const displayedAvatar = avatar || selectedAvatar;

  return (
    <div className="avatar">
      <input
        type="file"
        accept="image/*"
        id="avatarInput"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {displayedAvatar ? (
        <div className="preview-avatar">
          <div className="preview-avatar__avatar">
            {isLoading && <Loader />}
            <img src={URL.createObjectURL(displayedAvatar)} alt="new avatar" />
          </div>
          {avatar && (
            <div className="avatar-buttons">
              <OptionButton className="cancel" onClick={handleCancel}>
                <abbr title="Отменить">
                  <XmarkIcon />
                </abbr>
              </OptionButton>
              <OptionButton className="save" onClick={handleSave}>
                <abbr title="Сохранить">
                  <CheckIcon />
                </abbr>
              </OptionButton>
            </div>
          )}
        </div>
      ) : error || !initialAvatarUrl ? (
        <DrawOutlineRect strokeWidth={1} className="avatar-wrapper" rx="50%">
          <abbr title="Выбрать фотографию">
            <div className="empty-avatar" onClick={handleDivClick}>
              <CameraIcon />
            </div>
          </abbr>
        </DrawOutlineRect>
      ) : (
        <DrawOutlineRect strokeWidth={1} className="avatar-wrapper" rx="50%">
          <abbr title="Выбрать фотографию">
            <div className="update-avatar" onClick={handleDivClick}>
              <CameraIcon />
              <img src={initialAvatarUrl} alt="avatar" />
            </div>
          </abbr>
        </DrawOutlineRect>
      )}
    </div>
  );
};
