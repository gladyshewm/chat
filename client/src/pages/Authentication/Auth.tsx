import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Auth.css';
import { signInVariants, signUpVariants, TWEEN_TRANSITION } from '../../motion';
import CustomButton from '../../components/buttons/CustomButton/CustomButton';
import Modal from '../../components/Modal/Modal';
import LogInForm from '../../components/forms/LogInForm/LogInForm';
import CreateAccForm from '../../components/forms/CreateAccForm/CreateAccForm';
import DrawOutline from '../../components/DrawOutline/DrawOutlineRect/DrawOutlineRect';
import CustomLoader from '../../components/CustomLoader/CustomLoader';
import useAuth from '../../hooks/useAuth';

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
        <CustomLoader />
      ) : (
        <>
          <DrawOutline strokeWidth={2} rx="15px">
            <CustomButton
              className="login-button"
              onClick={() => setModalActive(true)}
              type="button"
            >
              Войти
            </CustomButton>
          </DrawOutline>
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
                <CreateAccForm />
              </motion.div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default Auth;
