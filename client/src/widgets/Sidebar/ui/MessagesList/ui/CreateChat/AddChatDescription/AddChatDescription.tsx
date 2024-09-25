import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import './AddChatDescription.css';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CheckIcon, UserIcon } from '@shared/assets';
import {
  CustomInput,
  DrawOutline,
  DrawOutlineRect,
  Loader,
  OptionButton,
} from '@shared/ui';
import { UserWithAvatar } from '@shared/types';
import { createChatButtonVariants } from '../../motion';
import { AvatarUploader } from '@features';
import { formatParticipants } from '@shared/utils';
import { useCreateChatSidebarMutation } from '../../Search/ui/SearchResultItem/search-result-item.generated';

interface AddChatDescriptionProps {
  setIsCreateChat: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChatDescription: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUsers: UserWithAvatar[];
}

export const AddChatDescription = ({
  setIsCreateChat,
  setIsChatDescription,
  selectedUsers,
}: AddChatDescriptionProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const navigate = useNavigate();
  const [createChat, { loading, error }] = useCreateChatSidebarMutation();

  const handleBackClick = () => {
    setIsChatDescription(false);
  };

  const handleSaveAvatar = async (file: File) => {
    setSelectedAvatar(file);
  };

  const handleSubmit = async (values: { chatName: string }) => {
    const { data } = await createChat({
      variables: {
        name: values.chatName || '',
        participantsIds: selectedUsers.map((user) => user.id),
        avatar: selectedAvatar,
      },
    });

    if (data?.createChat) {
      setIsChatDescription(false);
      setIsCreateChat(false);
      navigate(`/chat/${data.createChat.id}`);
    }
  };

  return (
    <div className="add-chat-description">
      {loading && <Loader />}
      <DrawOutline orientation="horizontal" position="bottom">
        <header>
          <OptionButton className="back" onClick={handleBackClick}>
            <abbr title="Назад">
              <ArrowLeftIcon />
            </abbr>
          </OptionButton>
          <h2>Создать чат</h2>
        </header>
      </DrawOutline>
      <main>
        <AvatarUploader
          onSave={handleSaveAvatar}
          selectedAvatar={selectedAvatar}
        />
        <Formik
          initialValues={{ chatName: '' }}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ isSubmitting, dirty, values }) => (
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
              {error && (
                <div style={{ color: 'var(--danger-color)' }}>
                  {error.message}
                </div>
              )}
              <motion.button
                className="create-chat-button"
                key="create-chat-button"
                type="submit"
                variants={createChatButtonVariants}
                initial="hidden"
                animate="animate"
                exit="exit"
                whileHover={
                  values.chatName === ''
                    ? undefined
                    : {
                        opacity: 1,
                        transition: { duration: 0.3 },
                      }
                }
                disabled={isSubmitting || !dirty}
              >
                <abbr title="Создать чат">
                  <CheckIcon />
                </abbr>
              </motion.button>
            </Form>
          )}
        </Formik>
        <div id="participants">
          <p id="participants-title">
            {formatParticipants(selectedUsers.length)}
          </p>
          {selectedUsers.map((user) => (
            <div key={user.id} className="participant">
              <div className="avatar">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" />
                ) : (
                  <UserIcon />
                )}
              </div>
              <p className="name">{user.name}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
