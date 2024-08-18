import { FC } from 'react';
import './ScrollButton.css';
import { AnimatePresence, motion } from 'framer-motion';
import { scrollButtonVariants } from './motion';
import { ArrowLeftIcon } from '@shared/ui/icons';

interface ScrollButtonProps {
  isScrolled: boolean;
  scrollToBottom: () => void;
}

export const ScrollButton: FC<ScrollButtonProps> = ({
  isScrolled,
  scrollToBottom,
}) => {
  return (
    <AnimatePresence mode="wait">
      {isScrolled && (
        <motion.button
          key="scroll-bottom"
          className="scroll-bottom"
          onClick={scrollToBottom}
          variants={scrollButtonVariants}
          whileHover={{ scale: 1.1, transition: { duration: 0.01 } }}
          initial="hidden"
          animate="animate"
          exit="exit"
        >
          <ArrowLeftIcon />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
