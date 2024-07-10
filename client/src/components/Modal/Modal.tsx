import React, { useState, useEffect, SetStateAction, FC } from 'react';
import './Modal.css';
import XmarkIcon from '../../icons/XmarkIcon';
import ChevronLeftIcon from '../../icons/ChevronLeftIcon';

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
  const [isInitial, setIsInitial] = useState<boolean>(true);

  useEffect(() => {
    if (active) {
      setIsInitial(false);
    }
  }, [active]);

  return (
    <div
      className={`modal ${active ? 'active' : ''} ${isInitial ? 'initial' : ''}`}
    >
      <div
        className={`modal__content ${active ? 'active' : ''} ${isInitial ? 'initial' : ''}`}
      >
        <div className="modal__buttons">
          {showBackButton && (
            <button
              onClick={handleBackClick}
              title="Назад"
              type="button"
              className="modal__close"
            >
              <ChevronLeftIcon />
            </button>
          )}
          <button
            title="Закрыть"
            type="button"
            className="modal__close"
            onClick={() => setActive(false)}
          >
            <XmarkIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
