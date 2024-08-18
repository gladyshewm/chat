import { FC } from 'react';
import './Cross.css';
import { AnimatePresence, motion } from 'framer-motion';

interface CrossProps {
  className?: string;
  stroke?: string;
  strokeWidth?: number;
}

const crossLineVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeInOut', delay: 0.5 },
  },
};

const circleVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { duration: 0.5, ease: 'easeInOut', delay: 1 },
  },
};

const Cross: FC<CrossProps> = ({
  className,
  stroke = 'var(--outline-main-color)',
  strokeWidth = 2,
}) => {
  return (
    <div className={`cross ${className ? className : ''}`}>
      <AnimatePresence>
        <motion.svg
          viewBox="0 0 200 200"
          initial="hidden"
          animate="visible"
          stroke={stroke}
          strokeWidth={strokeWidth}
        >
          <motion.line
            className="first-cross-line"
            x1="0"
            y1="0"
            x2="200"
            y2="200"
            initial="hidden"
            animate="visible"
            variants={crossLineVariants}
          />
          <motion.line
            className="second-cross-line"
            x1="0"
            y1="200"
            x2="200"
            y2="0"
            initial="hidden"
            animate="visible"
            variants={crossLineVariants}
          />
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 1 }}
            variants={circleVariants}
          />
        </motion.svg>
      </AnimatePresence>
    </div>
  );
};

export default Cross;
