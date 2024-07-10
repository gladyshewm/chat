import React, { FC, useState } from 'react';
import { motion } from 'framer-motion';
import './Auth.css';
import CustomButton from '../../components/CustomButton/CustomButton';
import Modal from '../../components/Modal/Modal';
import LogInForm from '../../components/LogInForm/LogInForm';
import CreateAccForm from '../../components/CreateAccForm/CreateAccForm';

const Auth: FC = () => {
  const [modalActive, setModalActive] = useState<boolean>(false);
  const [isLoginForm, setIsLoginForm] = useState<boolean>(true);

  const handleCreateAccountClick = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    e.preventDefault();
    setIsLoginForm(false);
  };
  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setIsLoginForm(true);
  };

  return (
    <motion.div className="auth">
      <CustomButton onClick={() => setModalActive(true)} type="button">
        Войти
      </CustomButton>
      <Modal
        active={modalActive}
        setActive={setModalActive}
        showBackButton={!isLoginForm}
        handleBackClick={handleBackClick}
      >
        {isLoginForm ? (
          <LogInForm handleCreateAccountClick={handleCreateAccountClick} />
        ) : (
          <CreateAccForm />
        )}
      </Modal>
    </motion.div>
  );
};

export default Auth;
