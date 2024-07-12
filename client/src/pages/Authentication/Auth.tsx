import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Auth.css';
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

  const SignUpVariants = {
    hidden: { scale: 0.95, opacity: 0.8 },
    visible: { scale: 1, opacity: 1 },
  };

  const SignInVariants = {
    hidden: { x: '10%' },
    visible: { x: 0 },
  };

  const transition = {
    type: 'tween',
    duration: 0.08,
    ease: 'linear',
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
            variants={SignInVariants}
            transition={transition}
          >
            <LogInForm handleCreateAccountClick={handleCreateAccountClick} />
          </motion.div>
        ) : (
          <motion.div
            key="signUp"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={SignUpVariants}
            transition={transition}
          >
            <CreateAccForm />
          </motion.div>
        )}
      </Modal>
    </div>
  );
};

export default Auth;
