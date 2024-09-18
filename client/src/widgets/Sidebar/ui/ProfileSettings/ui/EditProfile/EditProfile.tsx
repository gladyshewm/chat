import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import './EditProfile.css';
import { errorMessageVariants, successMessageVariants } from '../motion';
import { useProfile } from '@app/providers/hooks/useProfile';
import { useAuth } from '@app/providers/hooks/useAuth';
import {
  CustomButton,
  CustomInput,
  DrawOutline,
  DrawOutlineRect,
  Loader,
  OptionButton,
} from '@shared/ui';
import {
  ArrowLeftIcon,
  CameraIcon,
  CheckCircleIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  XmarkIcon,
} from '@shared/assets';
import DeleteModal from './DeleteModal/DeleteModal';
import {
  ChangeCredentialsSchema,
  validationChangeCredentialsSchema,
} from '@widgets/Auth';

interface EditProfileProps {
  setIsProfileInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfile = ({ setIsProfileInfo }: EditProfileProps) => {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    avatarUrl,
    errorQueryAvatar,
    handleUploadAvatar,
    handleChangeCredentials,
    profileLoadingStates,
  } = useProfile();
  const { user, deleteAccount, loadingStates } = useAuth();
  const initialValues: ChangeCredentialsSchema = {
    username: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  };

  const handleBackClick = () => {
    setIsProfileInfo(true);
  };

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

  const handleSubmitCredentials = async (values: ChangeCredentialsSchema) => {
    const credentials: ChangeCredentialsSchema = Object.entries(values).reduce(
      (acc, [key, value]) => {
        if (
          value !== initialValues[key as keyof ChangeCredentialsSchema] &&
          value !== ''
        ) {
          acc[key as keyof ChangeCredentialsSchema] = value;
        }
        return acc;
      },
      {} as ChangeCredentialsSchema,
    );

    if (Object.keys(credentials).length > 0) {
      const credentialsObj = {
        name: credentials.username,
        email: credentials.email,
        password: credentials.password,
      };

      const result = await handleChangeCredentials(credentialsObj).catch(
        (err) => handleErrorMessage(err.message),
      );

      if (result) handleSuccessMessage(result);
    }
  };

  const handleSuccessMessage = (message: string[]) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage([]), 5000);
  };

  const handleErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const removeMessage = (index: number) => {
    setSuccessMessage((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="edit-profile">
      <DrawOutline orientation="horizontal" position="bottom">
        <div className="edit-profile__header">
          <OptionButton className="back" onClick={handleBackClick}>
            <abbr title="Назад">
              <ArrowLeftIcon />
            </abbr>
          </OptionButton>
          <div className="edit-profile__title">
            <p>Редактирование профиля</p>
          </div>
        </div>
      </DrawOutline>
      <div className="edit-profile__main">
        <div className="avatar">
          <input
            type="file"
            accept="image/*"
            id="avatarInput"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {avatar ? (
            <div className="preview-avatar">
              <div className="preview-avatar__avatar">
                {profileLoadingStates.uploadAvatar && <Loader />}
                <img src={URL.createObjectURL(avatar)} alt="new avatar" />
              </div>
              <div className="avatar-buttons">
                <OptionButton className="cancel" onClick={handleCancel}>
                  <XmarkIcon />
                </OptionButton>
                <OptionButton
                  className="save"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleSave(e)
                  }
                >
                  <CheckIcon />
                </OptionButton>
              </div>
            </div>
          ) : errorQueryAvatar || !avatarUrl ? (
            <DrawOutlineRect
              strokeWidth={1}
              className="avatar-wrapper"
              rx="50%"
            >
              <div className="empty-avatar" onClick={handleDivClick}>
                <CameraIcon />
              </div>
            </DrawOutlineRect>
          ) : (
            <DrawOutlineRect
              strokeWidth={1}
              className="avatar-wrapper"
              rx="50%"
            >
              <div className="update-avatar" onClick={handleDivClick}>
                <CameraIcon />
                <img src={avatarUrl as string} alt="avatar" />
              </div>
            </DrawOutlineRect>
          )}
        </div>
        {profileLoadingStates.changeCredentials && <Loader />}
        <Formik
          initialValues={initialValues}
          validationSchema={validationChangeCredentialsSchema}
          onSubmit={(values) => handleSubmitCredentials(values)}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form>
              <div className="credentials">
                <DrawOutlineRect
                  className="profile__input-wrapper"
                  rx="15px"
                  strokeWidth={1}
                >
                  <CustomInput
                    name="username"
                    placeholder=" "
                    label="Имя"
                    spellCheck={false}
                  />
                </DrawOutlineRect>
                <DrawOutlineRect
                  className="profile__input-wrapper"
                  rx="15px"
                  strokeWidth={1}
                >
                  <CustomInput name="email" placeholder=" " label="E-mail" />
                </DrawOutlineRect>
                <DrawOutlineRect
                  className="profile__input-wrapper"
                  rx="15px"
                  strokeWidth={1}
                >
                  <CustomInput
                    name="password"
                    placeholder=" "
                    label="Пароль"
                    type="password"
                  />
                </DrawOutlineRect>
                <DrawOutlineRect
                  className="profile__input-wrapper"
                  rx="15px"
                  strokeWidth={1}
                >
                  <CustomInput
                    name="confirmPassword"
                    placeholder=" "
                    label="Подтверждение пароля"
                    type="password"
                  />
                </DrawOutlineRect>
                <DrawOutlineRect
                  className="button-wrapper"
                  rx="15px"
                  strokeWidth={1}
                >
                  <CustomButton
                    type="submit"
                    disabled={!isValid || isSubmitting || !dirty}
                  >
                    Изменить данные
                  </CustomButton>
                </DrawOutlineRect>
                <DrawOutlineRect
                  className="button-wrapper delete-button-wrapper"
                  rx="15px"
                  stroke="var(--danger-color-light)"
                  strokeWidth={1}
                >
                  <CustomButton
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Удалить профиль
                  </CustomButton>
                </DrawOutlineRect>
                <AnimatePresence>
                  {successMessage.length > 0 && (
                    <motion.div
                      className="success-message"
                      key="successMessage"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={{
                        animate: {
                          transition: {
                            staggerChildren: 0.1,
                          },
                        },
                      }}
                    >
                      {successMessage.map((msg, index) => (
                        <motion.div
                          className="message-wrapper"
                          key={index}
                          variants={successMessageVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onTap={() => removeMessage(index)}
                        >
                          <DrawOutlineRect
                            className="message-wrapper__rect"
                            rx="15px"
                            strokeWidth={1}
                            stroke="var(--col1)"
                            key={index}
                          >
                            <p>
                              <CheckCircleIcon />
                              {msg}
                            </p>
                          </DrawOutlineRect>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                  {errorMessage && (
                    <motion.div
                      key="errorMessage"
                      className="error-message"
                      variants={errorMessageVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      whileTap="tap"
                      onTap={() => setErrorMessage('')}
                    >
                      <div className="message-wrapper">
                        <DrawOutlineRect
                          className="message-wrapper__rect"
                          rx="15px"
                          strokeWidth={1}
                          stroke="var(--error-color)"
                        >
                          <p>
                            <ExclamationTriangleIcon />
                            {errorMessage}
                          </p>
                        </DrawOutlineRect>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <DeleteModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        handleDelete={deleteAccount}
        loading={loadingStates.deleteUser}
      />
    </div>
  );
};

export default EditProfile;
