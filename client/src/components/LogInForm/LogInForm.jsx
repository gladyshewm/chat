import React, { useState } from "react";
import { Formik, Form } from 'formik';
import { validationLoginSchema } from '../../utils/validate';
import CustomInput from "../CustomInput/CustomInput";
import CustomButton from "../CustomButton/CustomButton";
import useAuth from "../../hooks/useAuth";

const LogInForm = ({ handleCreateAccountClick }) => {
    const { login } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const initialValues = {
        email: '',
        password: ''
    };

    const signIn = async ({ email, password }) => {
        try {
            const user = await login(email, password);
            if (!user) {
                setErrorMessage('Ошибка входа. Проверьте правильность введённых данных');
            }
        } catch (error) {
            setErrorMessage('Ошибка входа. Проверьте правильность введённых данных');
            console.log(error);
        }
    }

    return (
        <div className="login-form">
            <Formik
                initialValues={initialValues}
                validationSchema={validationLoginSchema}
                onSubmit={(values) => signIn(values)}
            >
                <Form>
                    <CustomInput name="email" placeholder="E-mail" />
                    <CustomInput type="password" name="password" placeholder="••••••••••••" />
                    <CustomButton type="submit">Войти</CustomButton>
                    <CustomButton type="button" onClick={e => handleCreateAccountClick(e)}>Создать аккаунт</CustomButton>
                </Form>
            </Formik>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    )
};

export default LogInForm;
