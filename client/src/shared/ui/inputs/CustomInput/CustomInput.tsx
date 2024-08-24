import { FieldAttributes, useField } from 'formik';
import './CustomInput.css';

interface InputProps extends FieldAttributes<any> {
  label?: string;
  name: string;
}

export const CustomInput = ({ label, ...props }: InputProps) => {
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
