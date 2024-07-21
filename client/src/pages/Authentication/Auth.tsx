import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Auth.css';
import { signInVariants, signUpVariants, TWEEN_TRANSITION } from '../../motion';
import CustomButton from '../../components/CustomButton/CustomButton';
import Modal from '../../components/Modal/Modal';
import LogInForm from '../../components/LogInForm/LogInForm';
import CreateAccForm from '../../components/CreateAccForm/CreateAccForm';
import DrawOutline from '../../components/DrawOutline/DrawOutlineRect/DrawOutlineRect';

const Auth = () => {
  const [modalActive, setModalActive] = useState<boolean>(false);
  const [isLoginForm, setIsLoginForm] = useState<boolean>(true);

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
      <DrawOutline strokeWidth={2} rx="15px">
        <CustomButton onClick={() => setModalActive(true)} type="button">
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
            key="signIn"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={signInVariants}
            transition={TWEEN_TRANSITION}
          >
            <LogInForm handleCreateAccountClick={handleCreateAccountClick} />
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
    </div>
  );
};

export default Auth;
