import { Formik, Form } from 'formik';
import { motion } from 'framer-motion';
import './EditChatProfile.css';
import { AvatarUploader } from '@features';
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
import { useUploadChatAvatarMutation } from './edit-chat-profile.generated';

interface EditChatProfileProps {
  setIsEditChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditChatProfile = ({ setIsEditChat }: EditChatProfileProps) => {
  const { chat } = useChat();
  const [uploadChatAvatar, { loading: uploadLoading }] =
    useUploadChatAvatarMutation();

  const handleAvatarSave = async (avatar: File) => {
    await uploadChatAvatar({
      variables: {
        image: avatar,
        chatId: chat?.id as string,
      },
    });
  };

  const handleSubmit = (values: { chatName: string }) => {};

  const handleBackClick = () => {
    setIsEditChat(false);
  };

  return (
    <div className="edit-chat-profile">
      {uploadLoading && <Loader />}
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
