import { useState, useEffect } from "react";

const useValidation = (value, validations) => {
    const [isEmpty, setIsEmpty] = useState(true);
    const [minLengthError, setMinLengthError] = useState(false);
    const [isEmailError, setIsEmailError] = useState(false);
    const [validInput, setValidInput] = useState(false);
    const [passwordsMatchError, setPasswordsMatchError] = useState(false);

    useEffect(() => {
        for (const validation in validations) {
            switch (validation) {
                case 'minLength':
                    value.length < validations[validation] ? setMinLengthError("Минимальная длина " + validations[validation] + " символов") : setMinLengthError(false);
                    break;
                case 'isEmpty':
                    value ? setIsEmpty(false) : setIsEmpty("Поле не может быть пустым");
                    break;
                case 'isEmail':
                    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    re.test(String(value).toLowerCase()) ? setIsEmailError(false) : setIsEmailError("Некорректный email");
                    break;
                case 'passwordsMatch':
                    value === validations.passwordsMatch ? setPasswordsMatchError(false) : setPasswordsMatchError("Пароли не совпадают");
                    break;
                default:
                    break;
            }
        }
    }, [value, validations, validations.passwordsMatch]);

    useEffect(() => {
        if (isEmpty || minLengthError || isEmailError || passwordsMatchError) {
            setValidInput(false);
        } else {
            setValidInput(true);
        }
    }, [isEmpty, minLengthError, isEmailError, passwordsMatchError]);

    return {
        isEmpty,
        minLengthError,
        isEmailError,
        validInput,
        passwordsMatchError
    }
}

const useInput = (initialValue, validations) => {
    const [value, setValue] = useState(initialValue);
    const valid = useValidation(value, validations);
    const [isDirty, setDirty] = useState(false);

    const onChange = (e) => {
        setValue(e.target.value);
    }

    const onBlur = (e) => {
        setDirty(true);
    }

    return {
        value,
        onChange,
        onBlur,
        isDirty,
        ...valid
    }
}

export default useInput;