import React, { FC } from 'react';
import { FieldAttributes, useField } from 'formik';
import './CustomInput.css';

interface inputProps extends FieldAttributes<any> {
  label?: string;
  name: string;
}

const CustomInput: FC<inputProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const fieldClassName = meta.touched && meta.error ? 'custom-input error' : 'custom-input';
  return (
    <div className="input-block">
      <input {...field} {...props} className={fieldClassName} />
      {meta.touched && meta.error ? <span>{meta.error}</span> : null}
    </div>
  );
};

export default CustomInput;
