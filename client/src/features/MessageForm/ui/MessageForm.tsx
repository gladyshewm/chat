import React from 'react';
import { Field, Form, Formik } from 'formik';
import './MessageForm.css';
import { validationMessageFormSchema } from '../model/validate';
import { DrawOutlineRect, Emoji } from '@shared/ui';
import { SendIcon } from '@shared/assets';
import { useSendMessageMutation } from './message-form.generated';
import { UserInfo } from '@shared/types';

interface MessageFormProps {
  chat_id: string;
  onKeyDown?: (userName: string) => void;
  onBlur?: (userName: string) => void;
  onFocus?: (userName: string) => void;
  user: UserInfo;
}

export const MessageForm = ({
  onKeyDown,
  onBlur,
  onFocus,
  chat_id,
  user,
}: MessageFormProps) => {
  const [postMessage] = useSendMessageMutation();

  const sendMessage = (message: string) => {
    // const tempId = `temp_${Date.now()}`;
    if (chat_id && message) {
      postMessage({
        variables: {
          chatId: chat_id,
          content: message,
        },
        /* optimisticResponse: {
          sendMessage: {
            __typename: 'Message',
            id: tempId, //uuidv4()
            chatId: chat_id,
            userId: user.uuid as string,
            userName: user.name as string,
            content: message,
            avatarUrl: '',
            createdAt: new Date().toISOString(),
          },
        },
        update: (cache, { data }) => {
          if (data && data.sendMessage) {
            const newMessage = data.sendMessage;
            cache.modify({
              fields: {
                chatMessages(existingMessages = [], { readField }) {
                  const newMessageRef = cache.writeFragment({
                    data: newMessage,
                    fragment: gql`
                      fragment NewMessage on Message {
                        id
                        chatId
                        userId
                        userName
                        content
                        avatarUrl
                        createdAt
                      }
                    `,
                  });
                  if (
                    existingMessages.some(
                      (ref: any) => readField('id', ref) === newMessage.id,
                    )
                  ) {
                    return existingMessages;
                  }
                  return [...existingMessages, newMessageRef];
                },
              },
            });
          }
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
