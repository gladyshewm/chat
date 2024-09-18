import { useState } from 'react';
import { Formik, Form } from 'formik';
import { CustomButton, CustomInput, DrawOutlineRect, Loader } from '@shared/ui';
import { RegistrationSchema } from '../../model/validation/validationSchemas';
import { validationRegistrationSchema } from '../../model/validation/validate';
import { useAuth } from '@app/providers/hooks/useAuth';

const RegistrationForm = () => {
  const { register, loadingStates } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const initialValues: RegistrationSchema = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  };

  const createAccount = async ({
    username,
    email,
    password,
  }: RegistrationSchema) => {
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
      {loadingStates.createUser && <Loader />}
      <div className="login-form">
        <Formik
          initialValues={initialValues}
          validationSchema={validationRegistrationSchema}
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

export default RegistrationForm;
