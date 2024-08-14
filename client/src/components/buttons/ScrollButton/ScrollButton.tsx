import React, { FC } from 'react';
import './ScrollButton.css';
import { AnimatePresence, motion } from 'framer-motion';
import { scrollButtonVariants } from '../../../motion';
import ArrowLeftIcon from '../../../icons/ArrowLeftIcon';

interface ScrollButtonProps {
  isScrolled: boolean;
  scrollToBottom: () => void;
}

const ScrollButton: FC<ScrollButtonProps> = ({
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

export default ScrollButton;
