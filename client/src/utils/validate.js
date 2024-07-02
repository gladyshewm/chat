import * as Yup from 'yup';

const regex = {
    username: /^[а-яА-Яa-zA-Z]{3,20}$/,
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9]+$/,
    password: /^[a-zA-Z0-9]{6,}$/,
};

const username = Yup.string()
    .matches(regex.username, 'Имя должно содержать не менее 3 букв')
    .required("Введите имя");

const email = Yup.string()
    .matches(regex.email, 'Некорректный email')
    .required("Введите email");

const password = Yup.string()
    .matches(regex.password, 'Пароль должен содержать не менее  6 символов')
    .required("Введите пароль");

const confirmPassword = Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли не совпадают')
    .required("Введите пароль");

export const validationCreateAccSchema = Yup.object().shape({
    username,
    email,
    password,
    confirmPassword
});

export const validationLoginSchema = Yup.object().shape({
    email,
    password,
})