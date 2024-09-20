import { motion } from 'framer-motion';
import { DrawOutlineRect } from '@shared/ui';
import { CheckCircleIcon } from '@shared/assets';
import { successMessageVariants } from '../motion';

interface SuccessMessageProps {
  successMessage: string[];
  setSuccessMessage: React.Dispatch<React.SetStateAction<string[]>>;
}

export const SuccessMessage = ({
  successMessage,
  setSuccessMessage,
}: SuccessMessageProps) => {
  const removeMessage = (index: number) => {
    setSuccessMessage((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <motion.div
        className="notification-message"
        key="successMessage"
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
        {successMessage.map((msg, index) => (
          <motion.div
            className="message-wrapper"
            key={index}
            variants={successMessageVariants}
            whileHover="hover"
            whileTap="tap"
            onTap={() => removeMessage(index)}
          >
            <DrawOutlineRect
              className="message-wrapper__rect"
              rx="15px"
              strokeWidth={1}
              stroke="var(--col1)"
              key={index}
            >
              <p>
                <CheckCircleIcon />
                {msg}
              </p>
            </DrawOutlineRect>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};
