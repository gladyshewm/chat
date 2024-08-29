import { createPortal } from 'react-dom';
import './DeleteModal.css';
import { motion } from 'framer-motion';
import { CustomButton, DrawOutline, DrawOutlineRect, Loader } from '@shared/ui';
import { ExclamationTriangleIcon } from '@shared/assets';
import { useEffect, useState } from 'react';
import { deleteModalVariants } from './motion';

interface DeleteModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleDelete: () => void;
  loading: boolean;
}

const DeleteModal = ({
  isOpen,
  setIsOpen,
  handleDelete,
  loading,
}: DeleteModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) setIsMounted(true);
  }, [isOpen]);

  const handleAnimationComplete = () => {
    if (!isOpen) {
      setIsMounted(false);
    }
  };

  if (!isMounted) return null;

  return createPortal(
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
      onAnimationComplete={handleAnimationComplete}
    >
      {loading && <Loader />}
      <DrawOutlineRect
        className="modal-delete__wrapper"
        rx="15px"
        strokeWidth={1}
      >
        <motion.div
          className="modal-delete"
          variants={deleteModalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <DrawOutline
            orientation="horizontal"
            position="bottom"
            strokeWidth={1}
          >
            <header className="modal-delete__header">
              <ExclamationTriangleIcon />
              <div className="modal-delete__title">
                <h2>Удаление профиля</h2>
                <p>Это действие необратимо!</p>
              </div>
            </header>
          </DrawOutline>
          <main className="modal-delete__buttons">
            <DrawOutlineRect rx="15px" strokeWidth={1}>
              <CustomButton
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Отмена
              </CustomButton>
            </DrawOutlineRect>
            <DrawOutlineRect
              className="button-wrapper delete-button-wrapper"
              rx="15px"
              strokeWidth={1}
              stroke="var(--danger-color)"
            >
              <CustomButton
                className="modal-delete__button"
                onClick={handleDelete}
              >
                Удалить
              </CustomButton>
            </DrawOutlineRect>
          </main>
        </motion.div>
      </DrawOutlineRect>
    </motion.div>,
    document.getElementById('modal')!,
  );
};

export default DeleteModal;
