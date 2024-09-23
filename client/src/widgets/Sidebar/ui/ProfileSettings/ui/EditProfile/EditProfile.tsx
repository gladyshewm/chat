import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { AnimatePresence } from 'framer-motion';
import './EditProfile.css';
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
import { ArrowLeftIcon } from '@shared/assets';
import DeleteModal from './DeleteModal/DeleteModal';
import {
  ChangeCredentialsSchema,
  validationChangeCredentialsSchema,
} from '@widgets/Auth';
import { AvatarUploader, ErrorMessage, SuccessMessage } from '@features';

interface EditProfileProps {
  setIsProfileInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfile = ({ setIsProfileInfo }: EditProfileProps) => {
  const [successMessage, setSuccessMessage] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
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

  const handleErrorMessage = (message: string[]) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage([]), 5000);
  };

  return (
    <div className="edit-profile">
      <DrawOutline orientation="horizontal" position="bottom">
        <header className="edit-profile__header">
          <OptionButton className="back" onClick={handleBackClick}>
            <abbr title="Назад">
              <ArrowLeftIcon />
            </abbr>
          </OptionButton>
          <div className="edit-profile__title">
            <p>Редактирование профиля</p>
          </div>
        </header>
      </DrawOutline>
      <main className="edit-profile__main">
        <AvatarUploader
          initialAvatarUrl={avatarUrl as string}
          onSave={handleUploadAvatar}
          isLoading={profileLoadingStates.uploadAvatar}
          error={errorQueryAvatar}
        />
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
                    <SuccessMessage
                      successMessage={successMessage}
                      setSuccessMessage={setSuccessMessage}
                    />
                  )}
                  {errorMessage.length > 0 && (
                    <ErrorMessage
                      errorMessage={errorMessage}
                      setErrorMessage={setErrorMessage}
                    />
                  )}
                </AnimatePresence>
              </div>
            </Form>
          )}
        </Formik>
      </main>
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
