import React, { FC } from 'react';
import { FieldAttributes, useField } from 'formik';
import './CustomInput.css';

interface inputProps extends FieldAttributes<any> {
  label?: string;
  name: string;
}

const CustomInput: FC<inputProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const fieldClassName =
    meta.touched && meta.error ? 'input__field error' : 'input__field';
  return (
    <label className="input">
      <input {...field} {...props} className={fieldClassName} />
      <span className="input__label">{label}</span>
      {meta.touched && meta.error ? (
        <span className="input__error">{meta.error}</span>
      ) : null}
    </label>
  );
};

export default CustomInput;
