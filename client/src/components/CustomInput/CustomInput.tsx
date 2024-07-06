import React from 'react';
import { useField } from 'formik';
import './CustomInput.css';

const CustomInput = ({ label, ...props }: any) => {
  const [field, meta] = useField(props);
  const fieldClassName = meta.touched && meta.error ? 'error' : '';
  return (
    <div className="input-block">
      <input {...field} {...props} className={fieldClassName} />
      {meta.touched && meta.error ? <span>{meta.error}</span> : null}
    </div>
  );
};

export default CustomInput;
