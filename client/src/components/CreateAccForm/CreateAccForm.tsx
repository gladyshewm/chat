import React, { FC, useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../../graphql/mutations/user';
import { Formik, Form } from 'formik';
import { validationCreateAccSchema } from '../../utils/validate';
import CustomInput from '../CustomInput/CustomInput';
import CustomButton from '../CustomButton/CustomButton';
import useAuth from '../../hooks/useAuth';
import { CreateAccSchema } from '../../utils/validationSchemas';

const CreateAccForm: FC = () => {
  const [createUser] = useMutation(CREATE_USER);
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const initialValues: CreateAccSchema = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  };

  const createAccount = async ({
    username,
    email,
    password,
  }: CreateAccSchema) => {
    try {
      await createUser({
        variables: {
          input: {
            name: username,
            email: email,
            password: password,
          },
        },
      });
      await login(email, password);
    } catch (error) {
      setErrorMessage('Ошибка создания аккаунта. Попробуйте ещё раз.');
      console.log(error);
    }
  };

  return (
    <div className="login-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationCreateAccSchema}
        onSubmit={(values) => createAccount(values)}
      >
        <Form>
          <CustomInput name="email" placeholder="E-mail" />
          <CustomInput name="username" placeholder="Имя" />
          <CustomInput type="password" name="password" placeholder="Пароль" />
          <CustomInput
            type="password"
            name="confirmPassword"
            placeholder="Подтверждение пароля"
          />
          <CustomButton type="submit">Создать аккаунт</CustomButton>
        </Form>
      </Formik>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default CreateAccForm;
