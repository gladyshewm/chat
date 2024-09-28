import { useState } from 'react';
import { Formik, Form } from 'formik';
import { motion } from 'framer-motion';
import './EditChatProfile.css';
import { AvatarUploader, SuccessMessage } from '@features';
import {
  CustomInput,
  DrawOutline,
  DrawOutlineRect,
  Loader,
  OptionButton,
} from '@shared/ui';
import { ArrowLeftIcon, CheckIcon } from '@shared/assets';
import { chatProfileVariants } from '../motion';
import { useChat } from '@pages/Chat/providers/ChatProvider';
import { createChatButtonVariants } from '../../../../../Sidebar/ui/MessagesList/ui/motion';
import {
  useChangeChatNameMutation,
  useUploadChatAvatarMutation,
} from './edit-chat-profile.generated';

interface EditChatProfileProps {
  setIsEditChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditChatProfile = ({ setIsEditChat }: EditChatProfileProps) => {
  const [successMessage, setSuccessMessage] = useState<string[]>([]);
  const { chat } = useChat();
  const [uploadChatAvatar, { loading: uploadLoading }] =
    useUploadChatAvatarMutation();
  const [changeChatName, { loading: changeLoading }] =
    useChangeChatNameMutation();

  const handleAvatarSave = async (avatar: File) => {
    await uploadChatAvatar({
      variables: {
        image: avatar,
        chatId: chat?.id as string,
      },
    });
  };

  const handleSubmit = async (values: { chatName: string }) => {
    await changeChatName({
      variables: {
        chatId: chat?.id as string,
        newName: values.chatName,
      },
    });
    setSuccessMessage(['Название чата успешно изменено']);
  };

  const handleBackClick = () => {
    setIsEditChat(false);
  };

  return (
    <div className="edit-chat-profile">
      {(uploadLoading || changeLoading) && <Loader />}
      {successMessage.length > 0 && (
        <SuccessMessage
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
        />
      )}
      <DrawOutline orientation="horizontal" position="bottom">
        <motion.header
          className="chat-profile__header"
          variants={chatProfileVariants}
          initial="hidden"
          animate="visible"
        >
          <OptionButton className="close-button" onClick={handleBackClick}>
            <abbr title="Назад">
              <ArrowLeftIcon />
            </abbr>
          </OptionButton>
          <div className="chat-profile__title">
            <p>Редактирование чата</p>
          </div>
        </motion.header>
      </DrawOutline>
      <main>
        <AvatarUploader
          initialAvatarUrl={chat?.groupAvatarUrl || ''}
          onSave={handleAvatarSave}
        />
        <Formik
          initialValues={{ chatName: chat?.name || '' }}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ isSubmitting, dirty }) => (
            <Form>
              <DrawOutlineRect
                className="profile__input-wrapper"
                rx="15px"
                strokeWidth={1}
              >
                <CustomInput
                  name="chatName"
                  placeholder=" "
                  label="Название чата"
                  spellCheck={false}
                />
              </DrawOutlineRect>
              <motion.button
                className="create-chat-button"
                key="create-chat-button"
                type="submit"
                variants={createChatButtonVariants}
                initial="hidden"
                animate="animate"
                exit="exit"
                whileHover={
                  isSubmitting || !dirty
                    ? undefined
                    : {
                        opacity: 1,
                        transition: { duration: 0.3 },
                      }
                }
                disabled={isSubmitting || !dirty}
              >
                <abbr title="Применить изменения">
                  <CheckIcon />
                </abbr>
              </motion.button>
            </Form>
          )}
        </Formik>
      </main>
    </div>
  );
};

export default EditChatProfile;
