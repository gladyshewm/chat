import React, { FC, useState } from 'react';
import { Formik, Form } from 'formik';
import { validationLoginSchema } from '../../utils/validate';
import CustomInput from '../CustomInput/CustomInput';
import CustomButton from '../CustomButton/CustomButton';
import useAuth from '../../hooks/useAuth';
import { LoginSchema } from '../../utils/validationSchemas';

interface LogInFormProps {
  handleCreateAccountClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const LogInForm: FC<LogInFormProps> = ({ handleCreateAccountClick }) => {
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const initialValues: LoginSchema = {
    email: '',
    password: '',
  };

  const signIn = async ({ email, password }: LoginSchema) => {
    try {
      await login(email, password);
    } catch (error) {
      setErrorMessage('Ошибка входа. Проверьте правильность введённых данных');
      console.log(error);
    }
  };

  return (
    <div className="login-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationLoginSchema}
        onSubmit={(values) => signIn(values)}
      >
        <Form>
          <CustomInput name="email" placeholder="E-mail" />
          <CustomInput
            type="password"
            name="password"
            placeholder="••••••••••••"
          />
          <CustomButton type="submit">Войти</CustomButton>
          <CustomButton
            type="button"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              handleCreateAccountClick(e)
            }
          >
            Создать аккаунт
          </CustomButton>
        </Form>
      </Formik>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default LogInForm;
