import { motion } from 'framer-motion';
import './NoMessagesIllustration.css';

const NoMessagesIllustration = () => {
  return (
    <motion.div
      className="no-messages-illustration"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="speech-bubble"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <motion.div className="dots">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="dot"
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default NoMessagesIllustration;
