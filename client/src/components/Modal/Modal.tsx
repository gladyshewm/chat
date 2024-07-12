import React, { SetStateAction, FC, useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './Modal.css';
import XmarkIcon from '../../icons/XmarkIcon';
import ChevronLeftIcon from '../../icons/ChevronLeftIcon';
import DrawOutline from '../DrawOutline/DrawOutlineRect/DrawOutlineRect';

interface ModalProps {
  active: boolean;
  setActive: React.Dispatch<SetStateAction<boolean>>;
  showBackButton: boolean;
  handleBackClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({
  active,
  setActive,
  showBackButton,
  handleBackClick,
  children,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const { width, height } = contentRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, [active, children]);

  const modalContentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const transition = {
    type: 'tween',
    duration: 0.05,
    ease: 'linear',
  };

  if (!active) return null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        variants={modalContentVariants}
        transition={transition}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`modal ${active ? 'active' : ''}`}
      >
        <DrawOutline
          key={`${dimensions.width}-${dimensions.height}`}
          className="modal-outline"
          rx="15px"
        >
          <motion.div
            variants={modalVariants}
            transition={transition}
            className="modal__content"
            ref={contentRef}
          >
            <div className="modal__buttons">
              {showBackButton && (
                <DrawOutline rx="50%">
                  <button
                    onClick={handleBackClick}
                    title="Назад"
                    type="button"
                    className="modal__close"
                  >
                    <ChevronLeftIcon />
                  </button>
                </DrawOutline>
              )}
              <DrawOutline rx="50%">
                <button
                  title="Закрыть"
                  type="button"
                  className="modal__close"
                  onClick={() => setActive(false)}
                >
                  <XmarkIcon />
                </button>
              </DrawOutline>
            </div>
            {children}
          </motion.div>
        </DrawOutline>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
