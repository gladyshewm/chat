import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './CustomLoader.css';
import {
  circleTransition,
  circleVariants,
  containerTransition,
  containerVariants,
} from '../../motion';

interface CustomLoaderProps {
  size?: number;
  color?: string;
}

const CustomLoader: React.FC<CustomLoaderProps> = ({
  size = 100,
  color = '#fff',
}) => {
  return (
    <AnimatePresence>
      <motion.div className="custom-loader-wrapper">
        <motion.div
          className="custom-loader"
          style={{ width: size, height: size }}
          variants={containerVariants}
          initial="start"
          animate="end"
          transition={containerTransition}
        >
          {[0, 1, 2].map((index) => (
            <motion.span
              key={Math.random().toString()}
              className="loader-circle"
              style={{
                backgroundColor: color,
                width: size / 5,
                height: size / 5,
              }}
              variants={circleVariants}
              initial="start"
              animate="end"
              transition={{ ...circleTransition, delay: index * 0.25 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CustomLoader;
