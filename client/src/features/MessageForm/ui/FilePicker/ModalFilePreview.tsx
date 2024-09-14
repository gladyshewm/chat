import { useEffect, useState } from 'react';
import './ModalFilePreview.css';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { ApolloError } from '@apollo/client';
import { DrawOutlineRect, Emoji, Loader, OptionButton } from '@shared/ui';
import { XmarkIcon } from '@shared/assets';
import { deleteModalVariants } from 'widgets/Sidebar/ui/ProfileSettings/ui/EditProfile/DeleteModal/motion';

interface ModalFilePreviewProps {
  file: File;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  sendMessage: (message: string | null, attachedFiles: File[]) => Promise<void>;
  sendMessageLoading: boolean;
  sendMessageError: ApolloError | undefined;
}

const ModalFilePreview = ({
  file,
  isOpen,
  setIsOpen,
  sendMessage,
  sendMessageLoading,
  sendMessageError,
}: ModalFilePreviewProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setIsMounted(true);
  }, [isOpen]);

  const handleAnimationComplete = () => {
    if (!isOpen) {
      setIsMounted(false);
    }
  };

  if (!isMounted) return null;

  const handleCloseButton = () => {
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    await sendMessage(message, [file]);
    if (!sendMessageError && !sendMessageLoading) {
      setIsOpen(false);
      setMessage(null);
    }
  };

  return createPortal(
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
      onAnimationComplete={handleAnimationComplete}
    >
      {sendMessageLoading && <Loader />}
      <DrawOutlineRect
        className="modal-file-preview__wrapper"
        rx="15px"
        strokeWidth={2}
      >
        <motion.div
          className="modal-file-preview"
          variants={deleteModalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <header>
            <OptionButton className="close-button" onClick={handleCloseButton}>
              <abbr title="Закрыть чат">
                <XmarkIcon />
              </abbr>
            </OptionButton>
            <p>Отправить файл</p>
          </header>
          <main>
            <div className="img-wrapper">
              <img src={URL.createObjectURL(file)} alt="" />
            </div>
          </main>
          {sendMessageError && (
            <p style={{ color: 'var(--error-color)' }}>
              Ошибка: {sendMessageError.message}
            </p>
          )}
          <footer>
            <Emoji
              onEmojiSelect={(emoji) => {
                setMessage(message + emoji);
              }}
            />
            <input
              type="text"
              name="message"
              id="message-input"
              className="message-input"
              placeholder="Добавить подпись"
              autoComplete="off"
              value={message || ''}
              onChange={(e) => setMessage(e.target.value)}
              onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) =>
                e.key === 'Enter' && handleSubmit()
              }
            />
            <button
              type="submit"
              className="send-file-button"
              onClick={handleSubmit}
            >
              <span>Отправить</span>
            </button>
          </footer>
        </motion.div>
      </DrawOutlineRect>
    </motion.div>,
    document.getElementById('modal')!,
  );
};

export default ModalFilePreview;
