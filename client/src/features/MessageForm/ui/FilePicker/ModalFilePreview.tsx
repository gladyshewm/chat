import './ModalFilePreview.css';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { DrawOutlineRect, OptionButton } from '@shared/ui';
import { useEffect, useState } from 'react';
import { deleteModalVariants } from 'widgets/Sidebar/ui/ProfileSettings/ui/EditProfile/DeleteModal/motion';
import { XmarkIcon } from '@shared/assets';

interface ModalFilePreviewProps {
  file: File;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ModalFilePreview = ({
  file,
  isOpen,
  setIsOpen,
}: ModalFilePreviewProps) => {
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

  const handleCloseButton = () => {
    setIsOpen(false);
  };

  return createPortal(
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
      onAnimationComplete={handleAnimationComplete}
    >
      <DrawOutlineRect
        className="modal-file-preview__wrapper"
        rx="15px"
        strokeWidth={1}
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
          <footer>Футер</footer>
        </motion.div>
      </DrawOutlineRect>
    </motion.div>,
    document.getElementById('modal')!,
  );
};

export default ModalFilePreview;
