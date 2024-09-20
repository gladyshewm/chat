import './ErrorMessage.css';
import { motion } from 'framer-motion';
import { DrawOutlineRect } from '@shared/ui';
import { ExclamationTriangleIcon } from '@shared/assets';
import { errorMessageVariants } from '../motion';

interface ErrorMessageProps {
  errorMessage: string[];
  setErrorMessage: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ErrorMessage = ({
  errorMessage,
  setErrorMessage,
}: ErrorMessageProps) => {
  const removeMessage = (index: number) => {
    setErrorMessage((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <motion.div
        className="notification-message"
        key="errorMessage"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          animate: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {errorMessage.map((msg, index) => (
          <motion.div
            className="message-wrapper"
            key={index}
            variants={errorMessageVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            onTap={() => removeMessage(index)}
          >
            <DrawOutlineRect
              className="message-wrapper__rect"
              rx="15px"
              strokeWidth={1}
              stroke="var(--error-color)"
            >
              <p>
                <ExclamationTriangleIcon />
                {msg}
              </p>
            </DrawOutlineRect>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};
