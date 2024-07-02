import React, { useState } from "react";
import "./Auth.css";
import Modal from "../../components/Modal/Modal";
import LogInForm from "../../components/LogInForm/LogInForm";
import CreateAccForm from "../../components/CreateAccForm/CreateAccForm";
import CustomButton from "../../components/CustomButton/CustomButton";

const Auth = () => {
    const [modalActive, setModalActive] = useState(false);
    const [isLoginForm, setIsLoginForm] = useState(true);

    const handleCreateAccountClick = (e) => {
        e.preventDefault();
        setIsLoginForm(false);
    };
    const handleBackClick = (e) => {
        e.preventDefault();
        setIsLoginForm(true);
    };

    return (
        <div className="auth">
            <CustomButton onClick={() => setModalActive(true)} type="button" >Войти</CustomButton>
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
        </div>
    )
};

export default Auth;
