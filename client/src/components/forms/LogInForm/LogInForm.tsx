import React, { FC, useState } from 'react';
import { Formik, Form } from 'formik';
import { validationLoginSchema } from '../../../utils/validate';
import CustomInput from '../../inputs/CustomInput/CustomInput';
import CustomButton from '../../buttons/CustomButton/CustomButton';
import useAuth from '../../../hooks/useAuth';
import { LoginSchema } from '../../../utils/validationSchemas';
import './LogInForm.css';
import DrawOutlineRect from '../../DrawOutline/DrawOutlineRect/DrawOutlineRect';
import CustomLoader from '../../CustomLoader/CustomLoader';

interface LogInFormProps {
  handleCreateAccountClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const LogInForm: FC<LogInFormProps> = ({ handleCreateAccountClick }) => {
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
      {loadingStates.logIn && <CustomLoader />}
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
          </Form>
        </Formik>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </>
  );
};

export default LogInForm;
