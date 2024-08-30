import React from 'react';
import { Field, Form, Formik } from 'formik';
import './MessageForm.css';
import { validationMessageFormSchema } from '../model/validate';
import { DrawOutlineRect, Emoji } from '@shared/ui';
import { SendIcon } from '@shared/assets';
import { useSendMessageMutation } from './message-form.generated';

interface MessageFormProps {
  chat_id: string;
  onKeyDown?: (userName: string) => void;
  onBlur?: (userName: string) => void;
  onFocus?: (userName: string) => void;
}

export const MessageForm = ({
  onKeyDown,
  onBlur,
  onFocus,
  chat_id,
}: MessageFormProps) => {
  const [postMessage] = useSendMessageMutation();

  const sendMessage = (message: string) => {
    if (chat_id && message) {
      // onOptimisticUpdate(optimisticMessage);

      postMessage({
        variables: {
          chatId: chat_id,
          content: message,
        },
        /* optimisticResponse: {
          sendMessage: {
            id: Math.random().toString(),
            chatId: chat_id,
            userId: user?.uuid as string,
            userName: user?.name as string,
            content: message,
            avatarUrl: '',
            createdAt: new Date().toISOString(),
            __typename: 'Message',
          },
        }, */
      });
    }
  };

  return (
    <Formik
      initialValues={{ message: '' }}
      validationSchema={validationMessageFormSchema}
      onSubmit={(values, { resetForm }) => {
        sendMessage(values.message);
        resetForm();
      }}
    >
      {({ values, handleChange, handleSubmit, setFieldValue }) => (
        <Form className="message-form" id="message-form">
          <DrawOutlineRect rx={'15px'} className={'message-input-wrapper'}>
            <Emoji
              onEmojiSelect={(emoji) => {
                setFieldValue('message', values.message + emoji);
              }}
            />
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
              <abbr title="Отправить сообщение">
                <SendIcon />
              </abbr>
            </button>
          </DrawOutlineRect>
        </Form>
      )}
    </Formik>
  );
};
