import React, { FC } from 'react';
import { Field, Form, Formik } from 'formik';
import './MessageForm.css';
import { validationMessageFormSchema } from '../model/validate';
import { DrawOutlineRect, SendIcon } from '@shared/ui';

interface MessageFormProps {
  sendMessage: (message: string) => void;
  onKeyDown?: (userName: string) => void;
  onBlur?: (userName: string) => void;
  onFocus?: (userName: string) => void;
}

const MessageForm: FC<MessageFormProps> = ({
  sendMessage,
  onKeyDown,
  onBlur,
  onFocus,
}) => {
  return (
    <Formik
      initialValues={{ message: '' }}
      validationSchema={validationMessageFormSchema}
      onSubmit={(values, { resetForm }) => {
        sendMessage(values.message);
        resetForm();
      }}
    >
      {({ values, handleChange, handleSubmit }) => (
        <Form className="message-form" id="message-form">
          <DrawOutlineRect rx={'15px'} className={'message-input-wrapper'}>
            <Field
              type="text"
              name="message"
              id="message-input"
              className="message-input"
              onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) =>
                e.key === 'Enter' && handleSubmit()
              }
              onKeyDown={onKeyDown}
              onBlur={onBlur}
              onFocus={onFocus}
            />
          </DrawOutlineRect>
          <DrawOutlineRect rx={'50%'} className="send-button-wrapper">
            <button type="submit" className="send-button">
              <SendIcon />
            </button>
          </DrawOutlineRect>
        </Form>
      )}
    </Formik>
  );
};

export default MessageForm;
