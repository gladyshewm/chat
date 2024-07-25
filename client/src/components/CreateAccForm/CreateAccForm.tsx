import React, { FC, useState } from 'react';
import { Formik, Form } from 'formik';
import { validationCreateAccSchema } from '../../utils/validate';
import CustomInput from '../CustomInput/CustomInput';
import CustomButton from '../CustomButton/CustomButton';
import useAuth from '../../hooks/useAuth';
import { CreateAccSchema } from '../../utils/validationSchemas';
import DrawOutlineRect from '../DrawOutline/DrawOutlineRect/DrawOutlineRect';
import CustomLoader from '../CustomLoader/CustomLoader';

const CreateAccForm: FC = () => {
  const { register, loadingStates } = useAuth();
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
      await register({
        name: username,
        email,
        password,
      });
    } catch (error) {
      setErrorMessage('Ошибка создания аккаунта. Попробуйте ещё раз.');
      console.log(error);
    }
  };

  return (
    <>
      {loadingStates.createUser && <CustomLoader />}
      <div className="login-form">
        <Formik
          initialValues={initialValues}
          validationSchema={validationCreateAccSchema}
          onSubmit={(values) => createAccount(values)}
        >
          <Form>
            <DrawOutlineRect className="input-wrapper" rx="15px">
              <CustomInput name="email" placeholder=" " label="E-mail" />
            </DrawOutlineRect>
            <DrawOutlineRect className="input-wrapper" rx="15px">
              <CustomInput name="username" placeholder=" " label="Имя" />
            </DrawOutlineRect>
            <DrawOutlineRect className="input-wrapper" rx="15px">
              <CustomInput
                type="password"
                name="password"
                placeholder=" "
                label="Пароль"
              />
            </DrawOutlineRect>
            <DrawOutlineRect className="input-wrapper" rx="15px">
              <CustomInput
                type="password"
                name="confirmPassword"
                placeholder=" "
                label="Подтвердите пароль"
              />
            </DrawOutlineRect>
            <DrawOutlineRect className="button-wrapper" rx="15px">
              <CustomButton type="submit">Создать аккаунт</CustomButton>
            </DrawOutlineRect>
          </Form>
        </Formik>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </>
  );
};

export default CreateAccForm;
