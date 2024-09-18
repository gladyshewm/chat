import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Auth.css';
import { CustomButton, DrawOutlineRect, Loader, Modal } from '@shared/ui';
import { signInVariants, signUpVariants } from './motion';
import { TWEEN_TRANSITION } from '@shared/constants/motion';
import { useAuth } from '@app/providers/hooks/useAuth';
import { LogInForm, RegistrationForm } from '@widgets';

const Auth = () => {
  const [modalActive, setModalActive] = useState<boolean>(false);
  const [isLoginForm, setIsLoginForm] = useState<boolean>(true);
  const { loadingStates } = useAuth();

  const handleCreateAccountClick = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    e.preventDefault();
    setTimeout(() => setIsLoginForm(false), 50);
  };
  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setTimeout(() => setIsLoginForm(true), 50);
  };

  return (
    <div className="auth">
      {loadingStates.checkAuth ? (
        <Loader />
      ) : (
        <>
          <DrawOutlineRect strokeWidth={2} rx="15px">
            <CustomButton
              className="login-button"
              onClick={() => setModalActive(true)}
              type="button"
            >
              Войти
            </CustomButton>
          </DrawOutlineRect>
          <Modal
            active={modalActive}
            setActive={setModalActive}
            showBackButton={!isLoginForm}
            handleBackClick={handleBackClick}
          >
            {isLoginForm ? (
              <motion.div
                className="auth-form"
                key="signIn"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={signInVariants}
                transition={TWEEN_TRANSITION}
              >
                <LogInForm
                  handleCreateAccountClick={handleCreateAccountClick}
                />
              </motion.div>
            ) : (
              <motion.div
                key="signUp"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={signUpVariants}
                transition={TWEEN_TRANSITION}
              >
                <RegistrationForm />
              </motion.div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default Auth;
