import { motion } from 'framer-motion';
import './NoUsersIllustration.css';

const NoUsersIllustration = () => {
  return (
    <motion.div
      className="no-users-illustration"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="user-group"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <div className="user" />
        <div className="user" style={{ height: '5rem' }} />
        <div className="user" />
      </motion.div>
    </motion.div>
  );
};

export default NoUsersIllustration;
