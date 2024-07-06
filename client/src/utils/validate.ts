import * as Yup from 'yup';
import { TRegex, CreateAccSchema, LoginSchema } from './validationSchemas';

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

export const validationCreateAccSchema: Yup.ObjectSchema<CreateAccSchema> =
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
