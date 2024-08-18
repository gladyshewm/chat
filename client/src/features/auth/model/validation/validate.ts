import * as Yup from 'yup';
import {
  ChangeCredentialsSchema,
  LoginSchema,
  RegistrationSchema,
  TRegex,
} from './validationSchemas';

const regex: TRegex = {
  username: /^[а-яА-Яa-zA-Z]{3,20}$/,
  email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9]+$/,
  password: /^[a-zA-Z0-9]{6,}$/,
};

const username = Yup.string()
  .matches(regex.username, 'Имя должно содержать не менее 3 букв')
  .required('Введите имя');

const email = Yup.string()
  .matches(regex.email, 'Некорректный email')
  .required('Введите email');

const password = Yup.string()
  .matches(regex.password, 'Пароль должен содержать не менее  6 символов')
  .required('Введите пароль');

const confirmPassword = Yup.string()
  .oneOf([Yup.ref('password')], 'Пароли не совпадают')
  .required('Введите пароль');

const changeCredentials = {
  username: Yup.string().test({
    name: 'len',
    message: 'Имя должно содержать не менее 3 букв',
    test: (value, ctx) => {
      const { username } = ctx.parent;
      return !value || username.length >= 3;
    },
  }),
  email: Yup.string().matches(regex.email, 'Некорректный email').optional(),
  password: Yup.string()
    .matches(regex.password, 'Пароль должен содержать не менее 6 символов')
    .optional(),
  confirmPassword: Yup.string().when('password', {
    is: (val: string) => val && val.length > 0,
    then: (schema) =>
      schema
        .oneOf([Yup.ref('password')], 'Пароли не совпадают')
        .required('Введите подтверждение пароля'),
    otherwise: (schema) =>
      schema.oneOf([Yup.ref('password')], 'Пароли не совпадают').optional(),
  }),
};

export const validationRegistrationSchema: Yup.ObjectSchema<RegistrationSchema> =
  Yup.object().shape({
    username,
    email,
    password,
    confirmPassword,
  });

export const validationLoginSchema: Yup.ObjectSchema<LoginSchema> =
  Yup.object().shape({
    email,
    password,
  });

export const validationChangeCredentialsSchema: Yup.ObjectSchema<ChangeCredentialsSchema> =
  Yup.object().shape({
    username: changeCredentials.username,
    email: changeCredentials.email,
    password: changeCredentials.password,
    confirmPassword: changeCredentials.confirmPassword,
  });
