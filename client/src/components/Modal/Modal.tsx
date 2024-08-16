import React, { SetStateAction, FC, useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './Modal.css';
import {
  modalContentVariants,
  modalTransition,
  modalVariants,
} from '../../motion';
import DrawOutline from '../DrawOutline/DrawOutlineRect/DrawOutlineRect';
import XmarkIcon from '../../icons/XmarkIcon';
import ChevronLeftIcon from '../../icons/ChevronLeftIcon';

interface ModalProps {
  active: boolean;
  setActive: React.Dispatch<SetStateAction<boolean>>;
  showBackButton?: boolean;
  handleBackClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
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

  if (!active) return null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        variants={modalContentVariants}
        transition={modalTransition}
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
            transition={modalTransition}
            ref={contentRef}
          >
            <div className="modal__main">
              <div className="modal__buttons">
                {showBackButton && (
                  <DrawOutline className="modal__back" rx="50%">
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
                <DrawOutline className="modal__back" rx="50%">
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
              <div className="modal__content">{children}</div>
            </div>
          </motion.div>
        </DrawOutline>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
