import { motion } from 'framer-motion';
import './NoChatsIllustration.css';
import { useState } from 'react';
const NoChatsIllustration = () => {
  const [isHover, setIsHover] = useState(false);

  return (
    <motion.div
      className="no-chats-illustration"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="folder"
        animate={{
          rotateY: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <div className="folder-front" />
        <div className="folder-tab" />
      </motion.div>
      {isHover && (
        <>
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              className="paper"
              initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
              animate={{
                x: Math.random() * 60 - 30,
                y: Math.random() * -60 - 20,
                opacity: [0, 1, 0],
                rotate: Math.random() * 180 - 90,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: index * 0.3,
              }}
            >
              <div className="paper-line" />
              <div className="paper-line" />
            </motion.div>
          ))}
        </>
      )}
    </motion.div>
  );
};

export default NoChatsIllustration;
