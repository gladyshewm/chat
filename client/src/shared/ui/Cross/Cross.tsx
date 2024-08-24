import './Cross.css';
import { AnimatePresence, motion } from 'framer-motion';
import { circleVariants, crossLineVariants } from './motion';

interface CrossProps {
  className?: string;
  stroke?: string;
  strokeWidth?: number;
}

const Cross = ({
  className,
  stroke = 'var(--outline-main-color)',
  strokeWidth = 2,
}: CrossProps) => {
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
