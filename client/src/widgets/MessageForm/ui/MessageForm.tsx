import { Field, Form, Formik } from 'formik';
import './MessageForm.css';
import { validationMessageFormSchema } from '../model/validate';
import { DrawOutlineRect, Emoji } from '@shared/ui';
import { SendIcon } from '@shared/assets';
import FilePicker from './FilePicker/FilePicker';
import { useSendMessageMutation } from './message-form.generated';
import { gql } from '@apollo/client';
import { useAuth } from '@app/providers/hooks/useAuth';

const NEW_MESSAGE_FRAGMENT = gql`
  fragment NewMessage on chatMessages {
    id
    userId
    userName
    content
    avatarUrl
    createdAt
    attachedFiles {
      fileId
      fileUrl
      fileName
    }
  }
`;

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
  const [postMessage, { loading, error }] = useSendMessageMutation();
  const { user } = useAuth();

  const sendMessage = async (
    message: string | null,
    attachedFiles: File[] = [],
  ) => {
    const tempId = `temp_${Date.now()}`;
    if (chat_id) {
      await postMessage({
        variables: {
          chatId: chat_id,
          content: message,
          attachedFiles: attachedFiles,
        },
        update: (cache, { data }) => {
          if (!data || !data.sendMessage) return;
          const newMessage = data.sendMessage;
          const messageId = cache.identify(newMessage);

          cache.modify({
            fields: {
              chatMessages(
                existingMessages = [],
                { readField, storeFieldName },
              ) {
                const isMessageExists = existingMessages.some(
                  (messageRef: any) =>
                    readField('id', messageRef) === messageId,
                );
                if (isMessageExists) return existingMessages;

                const match = storeFieldName.match(/chatMessages\((\{.*\})\)/);
                if (!match) return existingMessages;
                const args = JSON.parse(match[1]);

                if (args.chatId !== chat_id) return existingMessages;

                const newMessageRef = cache.writeFragment({
                  data: newMessage,
                  fragment: NEW_MESSAGE_FRAGMENT,
                });

                return [...existingMessages, newMessageRef];
              },
            },
          });
        },
        optimisticResponse: {
          sendMessage: {
            __typename: 'Message',
            id: tempId, //uuidv4()???
            userName: user?.name as string,
            userId: user?.uuid as string,
            content: message,
            avatarUrl: '',
            createdAt: new Date().toISOString(),
            attachedFiles: [],
          },
        },
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
              placeholder="Сообщение"
              onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) =>
                e.key === 'Enter' && handleSubmit()
              }
              onKeyDown={onKeyDown}
              onBlur={onBlur}
              onFocus={onFocus}
            />
            <FilePicker
              sendMessage={sendMessage}
              sendMessageLoading={loading}
              sendMessageError={error}
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
