import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import './LogInForm.css';
import { CustomButton, CustomInput, DrawOutlineRect, Loader } from '@shared/ui';
import { useAuth } from '@app/providers/hooks/useAuth';
import { LoginSchema } from '../../model/validation/validationSchemas';
import { validationLoginSchema } from '../../model/validation/validate';

interface LogInFormProps {
  handleCreateAccountClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const LogInForm = ({ handleCreateAccountClick }: LogInFormProps) => {
  const { login, loadingStates } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const initialValues: LoginSchema = {
    email: '',
    password: '',
  };

  const signIn = async ({ email, password }: LoginSchema) => {
    try {
      await login({ email, password });
    } catch (error) {
      setErrorMessage('Ошибка входа. Проверьте правильность введённых данных');
      console.log(error);
    }
  };

  return (
    <>
      {loadingStates.logIn && <Loader />}
      <div className="login-form">
        <Formik
          initialValues={initialValues}
          validationSchema={validationLoginSchema}
          onSubmit={(values) => signIn(values)}
        >
          <Form>
            <DrawOutlineRect className="input-wrapper" rx="15px">
              <CustomInput name="email" placeholder=" " label="E-mail" />
            </DrawOutlineRect>
            <DrawOutlineRect className="input-wrapper" rx="15px">
              <CustomInput
                type="password"
                name="password"
                placeholder=" "
                label="Пароль"
              />
            </DrawOutlineRect>
            <div className="buttons">
              <DrawOutlineRect className="button-wrapper" rx="15px">
                <CustomButton type="submit">Войти</CustomButton>
              </DrawOutlineRect>
              <DrawOutlineRect className="button-wrapper" rx="15px">
                <CustomButton
                  type="button"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleCreateAccountClick(e)
                  }
                >
                  Создать аккаунт
                </CustomButton>
              </DrawOutlineRect>
            </div>
          </Form>
        </Formik>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </>
  );
};

export default LogInForm;
